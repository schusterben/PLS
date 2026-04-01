using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PLS.Api.Data;
using PLS.Api.Models;
using PLS.Api.Models.DTOs;
using PLS.Api.Models.Entities;
using PLS.Api.Services;

namespace PLS.Api.Controllers;

/// <summary>
/// Task 53: Clean v2 triage endpoints.
/// Differences from v1 (PersonenController):
///  - operationSceneId is an integer, not a JSON-stringified scene object.
///  - respiration and blutung are booleans, not strings.
///  - No V1Shim dependency.
/// </summary>
[ApiController]
public class PersonenV2Controller : ControllerBase
{
    private readonly PlsDbContext _context;
    private readonly IMqttPublishService _mqttService;

    public PersonenV2Controller(PlsDbContext context, IMqttPublishService mqttService)
    {
        _context = context;
        _mqttService = mqttService;
    }

    /// <summary>Returns all patients for the given operation scene.</summary>
    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/v2/persons")]
    public async Task<IActionResult> GetPersons([FromBody] PersonsV2Request request)
    {
        var patients = await _context.QrCodePatients
            .Where(q => q.OperationSceneId == request.operationSceneId && q.PatientId != null)
            .Join(_context.Patients,
                q => q.PatientId,
                p => p.Id,
                (q, p) => p)
            .ToListAsync();

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

    /// <summary>
    /// Updates the triage colour and optional vital signs for a patient.
    /// respiration and blutung are typed booleans in v2.
    /// </summary>
    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/v2/persons/{id}/update-triage-color")]
    public async Task<IActionResult> UpdateTriageColor(int id, [FromBody] UpdateTriageColorV2Request request)
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
        // v2: booleans mapped to string storage (legacy DB schema)
        if (request.respiration.HasValue) patient.Atmung = request.respiration.Value.ToString();
        if (request.blutung.HasValue) patient.Blutung = request.blutung.Value.ToString();

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

    /// <summary>Updates respiration status for a patient.</summary>
    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/v2/persons/{id}/respiration")]
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
            triagefarbe = patient.Triagefarbe,
            created_at = patient.CreatedAt,
            updated_at = patient.UpdatedAt
        });
    }

    /// <summary>
    /// Scans a patient QR code and links it to an operation scene.
    /// v2: operationSceneId is an integer — no JSON stringification needed.
    /// </summary>
    [Authorize(Policy = "TriageWrite")]
    [HttpPost("api/v2/verify-patient-qr-code")]
    public async Task<IActionResult> VerifyPatientQrCode([FromBody] VerifyPatientQrCodeV2Request request)
    {
        var qrCodePatient = await _context.QrCodePatients
            .FirstOrDefaultAsync(q => q.QrLogin == request.qr_code);

        if (qrCodePatient == null)
            return NotFound(new { message = "Ungültiger QR-Code" });

        if (qrCodePatient.PatientId != null)
        {
            qrCodePatient.OperationSceneId = request.operationSceneId;
            await _context.SaveChangesAsync();
            return Ok(new { patientId = qrCodePatient.PatientId });
        }

        var patient = new Patient();
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        var body = new Body
        {
            IdPatient = patient.Id,
            BodyParts = BodyPartConstants.CreateDefault()
        };
        _context.Bodies.Add(body);

        qrCodePatient.PatientId = patient.Id;
        qrCodePatient.OperationSceneId = request.operationSceneId;
        await _context.SaveChangesAsync();

        await _mqttService.PublishPatientStateAsync(patient.Id);

        return Ok(new { patientId = patient.Id });
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpGet("api/v2/persons/{patientId}/ambulanzprotokoll-page1")]
    public async Task<IActionResult> GetAmbulanzprotokollPage1(int patientId)
    {
        var patientExists = await _context.Patients.AnyAsync(patient => patient.Id == patientId);
        if (!patientExists)
            return NotFound(new { message = "Person nicht gefunden" });

        var form = await _context.AmbulanzprotokollPage1Forms
            .AsNoTracking()
            .FirstOrDefaultAsync(page => page.PatientId == patientId);

        if (form == null)
            return Ok(CreateResponse(patientId, "draft", AmbulanzprotokollPage1Defaults.DefaultFormState, null, null));

        return Ok(CreateResponse(
            patientId,
            form.Status,
            AmbulanzprotokollPage1Defaults.MergeWithDefaultFormState(form.FormStateJson),
            form.UpdatedAt,
            form.FinalizedAt));
    }

    [Authorize(Policy = "TriageWrite")]
    [HttpPut("api/v2/persons/{patientId}/ambulanzprotokoll-page1")]
    public async Task<IActionResult> PutAmbulanzprotokollPage1(int patientId, [FromBody] AmbulanzprotokollPage1UpsertRequest request)
    {
        var patientExists = await _context.Patients.AnyAsync(patient => patient.Id == patientId);
        if (!patientExists)
            return NotFound(new { message = "Person nicht gefunden" });

        if (request.Status is not ("draft" or "finalized"))
            return BadRequest(new { message = "Ungültiger Status" });

        var form = await _context.AmbulanzprotokollPage1Forms
            .FirstOrDefaultAsync(page => page.PatientId == patientId);

        if (form == null)
        {
            form = new AmbulanzprotokollPage1
            {
                PatientId = patientId
            };
            _context.AmbulanzprotokollPage1Forms.Add(form);
        }

        form.Status = request.Status;
        form.FormStateJson = request.FormState.ValueKind == JsonValueKind.Undefined
            ? AmbulanzprotokollPage1Defaults.DefaultFormState
            : AmbulanzprotokollPage1Defaults.MergeWithDefaultFormState(request.FormState.GetRawText());
        form.FinalizedAt = request.Status == "finalized" ? DateTime.UtcNow : null;

        await _context.SaveChangesAsync();

        return Ok(CreateResponse(patientId, form.Status, form.FormStateJson, form.UpdatedAt, form.FinalizedAt));
    }

    private static AmbulanzprotokollPage1Response CreateResponse(
        int patientId,
        string status,
        string formStateJson,
        DateTime? updatedAt,
        DateTime? finalizedAt)
    {
        using var document = JsonDocument.Parse(formStateJson);

        return new AmbulanzprotokollPage1Response
        {
            PatientId = patientId,
            Status = status,
            FormState = document.RootElement.Clone(),
            UpdatedAt = updatedAt,
            FinalizedAt = finalizedAt
        };
    }
}
