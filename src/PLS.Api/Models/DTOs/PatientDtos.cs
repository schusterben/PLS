using System.Text.Json;
using System.Text.Json.Serialization;

namespace PLS.Api.Models.DTOs;

// ── v1 requests (legacy — kept for frontend compatibility) ────────────────────
// operationScene is a JSON-stringified scene object from the v1 frontend.
// This shim is the only place that parses the stringified input; v2 uses typed IDs.
public record PersonsRequest(string operationScene);
public record UpdateTriageColorRequest(string? triageColor, double? lng, double? lat, string? respiration, string? bloodStopable);
public record UpdateRespirationRequest(string respiration, double? lng, double? lat);
public record VerifyPatientQrCodeRequest(string qr_code, string? operationScene);
public record VerifyPatientQrCodeResponse(int? patientId = null, string? message = null);

// ── v2 requests (clean contracts) ─────────────────────────────────────────────
// operationSceneId is an integer ID — no client-side JSON stringification needed.
// respiration and blutung are booleans rather than strings.
public record PersonsV2Request(int operationSceneId);
public record VerifyPatientQrCodeV2Request(string qr_code, int operationSceneId);
public record UpdateTriageColorV2Request(string? triageColor, bool? respiration, bool? blutung);
public record UpdateRespirationV2Request(bool respiration);
public record UpdatePatientLocationV2Request(double lat, double lng);

public class AmbulanzprotokollPage1UpsertRequest
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = "draft";

    [JsonPropertyName("formState")]
    public JsonElement FormState { get; set; }
}

public class AmbulanzprotokollPage1Response
{
    [JsonPropertyName("patientId")]
    public int PatientId { get; init; }

    [JsonPropertyName("status")]
    public string Status { get; init; } = "draft";

    [JsonPropertyName("formState")]
    public JsonElement FormState { get; init; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; init; }

    [JsonPropertyName("finalizedAt")]
    public DateTime? FinalizedAt { get; init; }
}
