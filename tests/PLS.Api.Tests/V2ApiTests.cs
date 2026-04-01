using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace PLS.Api.Tests;

/// <summary>
/// Task 53: Integration tests for v2 clean API contracts.
/// Validates that:
///  - v2 endpoints accept operationSceneId as a typed integer (not a stringified JSON object)
///  - v2 createOperationScene returns "operationScene" key (correct spelling, not "operactionScene")
///  - v2 triage update accepts boolean respiration/blutung
///  - v1 endpoints still function (backward compatibility is not broken)
/// </summary>
[Collection("Integration")]
public class V2ApiTests
{
    private readonly HttpClient _client;

    public V2ApiTests(PlsWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    // ── v2 createOperationScene: correct spelling ─────────────────────────────

    [Fact]
    public async Task V2CreateOperationScene_ReturnsOperationSceneKey_NotTypo()
    {
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/v2/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "V2 Test Scene" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);

        // v2 must use the correctly-spelled key
        Assert.True(data.ContainsKey("operationScene"),
            "v2 response must contain 'operationScene' (not the v1 typo 'operactionScene')");
        Assert.False(data.ContainsKey("operactionScene"),
            "v2 response must NOT contain the v1 typo 'operactionScene'");

        var scene = data["operationScene"].Deserialize<Dictionary<string, JsonElement>>()!;
        Assert.True(scene["idoperationScene"].GetInt32() > 0);
    }

    // ── v1 backward compatibility: typo key still present ─────────────────────

    [Fact]
    public async Task V1CreateOperationScene_StillReturnsTypoKey_ForBackwardCompat()
    {
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "V1 Compat Scene" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        Assert.True(data.ContainsKey("operactionScene"), "v1 typo key must still be present");
    }

    // ── v2 GET persons: typed operationSceneId ────────────────────────────────

    [Fact]
    public async Task V2GetPersons_WithTypedSceneId_ReturnsPatients()
    {
        var token = await GetAdminTokenAsync();
        var (patientId, sceneId) = await CreatePatientInSceneAsync(token);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/v2/persons")
        {
            Content = JsonContent.Create(new { operationSceneId = sceneId })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var patients = await response.Content.ReadFromJsonAsync<List<Dictionary<string, JsonElement>>>();
        Assert.NotNull(patients);
        Assert.Contains(patients, p => p["idpatient"].GetInt32() == patientId);
    }

    // ── v2 verify-patient-qr-code: typed operationSceneId ─────────────────────

    [Fact]
    public async Task V2VerifyPatientQrCode_WithTypedSceneId_CreatesPatient()
    {
        var token = await GetAdminTokenAsync();
        var sceneId = await CreateSceneAsync(token);
        var qrCode = await GeneratePatientQrCodeAsync(token);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/v2/verify-patient-qr-code")
        {
            Content = JsonContent.Create(new { qr_code = qrCode, operationSceneId = sceneId })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        Assert.True(data["patientId"].GetInt32() > 0);
    }

    [Fact]
    public async Task V2VerifyPatientQrCode_SameCodeTwice_ReturnsSamePatientId()
    {
        var token = await GetAdminTokenAsync();
        var sceneId = await CreateSceneAsync(token);
        var qrCode = await GeneratePatientQrCodeAsync(token);

        async Task<int> Scan()
        {
            var req = new HttpRequestMessage(HttpMethod.Post, "/api/v2/verify-patient-qr-code")
            {
                Content = JsonContent.Create(new { qr_code = qrCode, operationSceneId = sceneId })
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var resp = await _client.SendAsync(req);
            resp.EnsureSuccessStatusCode();
            var d = await resp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
            return d!["patientId"].GetInt32();
        }

        Assert.Equal(await Scan(), await Scan());
    }

    // ── v2 update-triage-color: boolean respiration ───────────────────────────

    [Fact]
    public async Task V2UpdateTriageColor_WithBooleanRespiration_Succeeds()
    {
        var token = await GetAdminTokenAsync();
        var patientId = await CreatePatientAsync(token);

        var request = new HttpRequestMessage(
            HttpMethod.Post, $"/api/v2/persons/{patientId}/update-triage-color")
        {
            Content = JsonContent.Create(new
            {
                triageColor = "grün",
                lat = 48.0,
                lng = 16.0,
                respiration = true,
                blutung = false
            })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.Equal("grün", data!["triagefarbe"].GetString());
    }

    // ── v2 getAllCurrentOperationScenes ───────────────────────────────────────

    [Fact]
    public async Task V2GetAllCurrentOperationScenes_ReturnsSceneList()
    {
        var token = await GetAdminTokenAsync();
        await CreateSceneAsync(token);

        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v2/getAllCurrentOperationScenes");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var scenes = await response.Content.ReadFromJsonAsync<List<Dictionary<string, JsonElement>>>();
        Assert.NotNull(scenes);
        Assert.NotEmpty(scenes);
        Assert.True(scenes[0].ContainsKey("idoperationScene"));
    }

    // ── v2 endpoints require authorization ────────────────────────────────────

    [Theory]
    [InlineData("POST", "/api/v2/persons")]
    [InlineData("POST", "/api/v2/verify-patient-qr-code")]
    [InlineData("POST", "/api/v2/createOperationScene")]
    [InlineData("GET", "/api/v2/getAllCurrentOperationScenes")]
    public async Task V2Endpoint_WithNoToken_Returns401(string method, string url)
    {
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private async Task<string> GetAdminTokenAsync()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return data!["token"].GetString()!;
    }

    private async Task<int> CreateSceneAsync(string token)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/v2/createOperationScene")
        {
            Content = JsonContent.Create(new { name = $"V2 Test {Guid.NewGuid():N}" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return data!["operationScene"].Deserialize<Dictionary<string, JsonElement>>()!["idoperationScene"].GetInt32();
    }

    private async Task<string> GeneratePatientQrCodeAsync(string token)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/generatePatientQRCodes")
        {
            Content = JsonContent.Create(new { number = 1 })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return data!["qrcodes"][0].GetString()!;
    }

    private async Task<int> CreatePatientAsync(string token)
    {
        var (patientId, _) = await CreatePatientInSceneAsync(token);
        return patientId;
    }

    private async Task<(int patientId, int sceneId)> CreatePatientInSceneAsync(string token)
    {
        var sceneId = await CreateSceneAsync(token);
        var qrCode = await GeneratePatientQrCodeAsync(token);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/v2/verify-patient-qr-code")
        {
            Content = JsonContent.Create(new { qr_code = qrCode, operationSceneId = sceneId })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return (data!["patientId"].GetInt32(), sceneId);
    }
}
