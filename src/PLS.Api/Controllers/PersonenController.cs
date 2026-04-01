using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PLS.Api.Data;
using PLS.Api.Models.DTOs;
using PLS.Api.Models.Entities;
using PLS.Api.Services;

namespace PLS.Api.Controllers;

[ApiController]
public class PersonenController : ControllerBase
{
    private readonly PlsDbContext _context;
    private readonly IMqttPublishService _mqttService;

    public PersonenController(PlsDbContext context, IMqttPublishService mqttService)
    {
        _context = context;
        _mqttService = mqttService;
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/persons")]
    public async Task<IActionResult> Index([FromBody] PersonsRequest request)
    {
        // v1 Shim: frontend passes operationScene as JSON.stringify(scene).
        // V2 callers should use POST api/v2/persons with a typed operationSceneId instead.
        var operationSceneId = V1Shim.ParseSceneId(request.operationScene);

        var patients = await _context.QrCodePatients
            .Where(q => q.OperationSceneId == operationSceneId && q.PatientId != null)
            .Join(_context.Patients,
                q => q.PatientId,
                p => p.Id,
                (q, p) => p)
            .ToListAsync();

        // Return with old field names for frontend compatibility
        var result = patients.Select(p => new
        {
            idpatient = p.Id,
            atmung = p.Atmung,
            blutung = p.Blutung,
            radialispuls = p.Radialispuls,
            triagefarbe = p.Triagefarbe,
            transport = p.Transport,
            dringend = p.Dringend,
            kontaminiert = p.Kontaminiert,
            name = p.Name,
            longitude_patient = p.LongitudePatient,
            latitude_patient = p.LatitudePatient,
            user_iduser = p.UserIdUser,
            created_at = p.CreatedAt,
            updated_at = p.UpdatedAt
        });

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("api/test-db")]
    public async Task<IActionResult> TestDb()
    {
        var person = await _context.Persons.FirstOrDefaultAsync();
        if (person == null)
            return NotFound(new { error = "Keine Daten gefunden." });
        return Ok(person);
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/persons/{id}/respiration")]
    public async Task<IActionResult> UpdateRespiration(int id, [FromBody] UpdateRespirationRequest request)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
        if (patient == null)
            return NotFound(new { message = "Person nicht gefunden" });

        patient.Atmung = request.respiration;
        patient.LongitudePatient = request.lng;
        patient.LatitudePatient = request.lat;
        await _context.SaveChangesAsync();

        await _mqttService.PublishPatientStateAsync(id);

        return Ok(new
        {
            idpatient = patient.Id,
            atmung = patient.Atmung,
            blutung = patient.Blutung,
            radialispuls = patient.Radialispuls,
            triagefarbe = patient.Triagefarbe,
            transport = patient.Transport,
            dringend = patient.Dringend,
            kontaminiert = patient.Kontaminiert,
            name = patient.Name,
            longitude_patient = patient.LongitudePatient,
            latitude_patient = patient.LatitudePatient,
            user_iduser = patient.UserIdUser,
            created_at = patient.CreatedAt,
            updated_at = patient.UpdatedAt
        });
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/persons/{id}/update-triage-color")]
    public async Task<IActionResult> UpdateTriageColor(int id, [FromBody] UpdateTriageColorRequest request)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
        if (patient == null)
            return NotFound(new { message = "Person nicht gefunden" });

        if (request.triageColor != null) patient.Triagefarbe = request.triageColor;
        if (request.lng != null && request.lat != null)
        {
            patient.LongitudePatient = request.lng;
            patient.LatitudePatient = request.lat;
        }
        if (request.respiration != null) patient.Atmung = request.respiration;
        if (request.bloodStopable != null) patient.Blutung = request.bloodStopable;

        await _context.SaveChangesAsync();

        await _mqttService.PublishPatientStateAsync(id);

        return Ok(new
        {
            idpatient = patient.Id,
            atmung = patient.Atmung,
            blutung = patient.Blutung,
            radialispuls = patient.Radialispuls,
            triagefarbe = patient.Triagefarbe,
            transport = patient.Transport,
            dringend = patient.Dringend,
            kontaminiert = patient.Kontaminiert,
            name = patient.Name,
            longitude_patient = patient.LongitudePatient,
            latitude_patient = patient.LatitudePatient,
            user_iduser = patient.UserIdUser,
            created_at = patient.CreatedAt,
            updated_at = patient.UpdatedAt
        });
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/verify-patient-qr-code")]
    public async Task<IActionResult> VerifyPatientQrCode([FromBody] VerifyPatientQrCodeRequest request)
    {
        // Lock the QR row while deciding whether to create or reuse a patient.
        // This prevents two concurrent scans of the same code from creating two patients.
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var qrCodePatient = await _context.QrCodePatients
            .FromSqlInterpolated(
                $"SELECT * FROM qr_code_patients WHERE qr_login = {request.qr_code} FOR UPDATE")
            .AsTracking()
            .FirstOrDefaultAsync();

        if (qrCodePatient == null)
            return NotFound(new { message = "Ungültiger QR-Code" });

        if (qrCodePatient.PatientId != null)
        {
            // Already linked to a patient
            if (request.operationScene != null)
            {
                // v1 Shim: see V1Shim.ParseSceneId
                qrCodePatient.OperationSceneId = V1Shim.ParseSceneId(request.operationScene);
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
            return Ok(new { patientId = qrCodePatient.PatientId });
        }

        var patient = new Patient();
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        // Create body record
        var body = new Body
        {
            IdPatient = patient.Id,
            BodyParts = BodyPartConstants.CreateDefault()
        };
        _context.Bodies.Add(body);

        // Link QR code to patient
        qrCodePatient.PatientId = patient.Id;
        if (request.operationScene != null)
        {
            // v1 Shim: see V1Shim.ParseSceneId
            qrCodePatient.OperationSceneId = V1Shim.ParseSceneId(request.operationScene);
        }
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        await _mqttService.PublishPatientStateAsync(patient.Id);

        return Ok(new { patientId = patient.Id });
    }
}

/// <summary>
/// Isolates the v1 frontend quirk: operationScene is passed as JSON.stringify(scene),
/// a string containing the full scene object rather than a plain integer ID.
/// This shim is the single point of coupling to that legacy convention.
/// Remove this class once the frontend migrates to v2 endpoints.
/// </summary>
internal static class V1Shim
{
    /// <summary>Extracts the idoperationScene integer from a JSON-stringified scene object.</summary>
    public static int ParseSceneId(string operationSceneJson)
    {
        var element = JsonSerializer.Deserialize<JsonElement>(operationSceneJson);
        return element.GetProperty("idoperationScene").GetInt32();
    }
}
