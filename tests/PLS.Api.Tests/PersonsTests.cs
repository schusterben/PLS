using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace PLS.Api.Tests;

[Collection("Integration")]
public class PersonsTests
{
    private readonly HttpClient _client;
    private readonly PlsWebAppFactory _factory;

    public PersonsTests(PlsWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // ── QR code + patient creation ─────────────────────────────────────────────

    [Fact]
    public async Task VerifyPatientQrCode_NewCode_CreatesPatientAndReturnsId()
    {
        var token = await GetAdminTokenAsync();
        var qrCode = await GeneratePatientQrCodeAsync(token);
        var scene = await CreateOperationSceneAsync(token);
        var sceneJson = JsonSerializer.Serialize(scene);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/verify-patient-qr-code")
        {
            Content = JsonContent.Create(new { qr_code = qrCode, operationScene = sceneJson })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        Assert.True(data["patientId"].GetInt32() > 0);
    }

    [Fact]
    public async Task VerifyPatientQrCode_SameCodeTwice_ReturnsSamePatientId()
    {
        var token = await GetAdminTokenAsync();
        var qrCode = await GeneratePatientQrCodeAsync(token);
        var scene = await CreateOperationSceneAsync(token);
        var sceneJson = JsonSerializer.Serialize(scene);

        async Task<int> Scan()
        {
            var req = new HttpRequestMessage(HttpMethod.Post, "/api/verify-patient-qr-code")
            {
                Content = JsonContent.Create(new { qr_code = qrCode, operationScene = sceneJson })
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var resp = await _client.SendAsync(req);
            resp.EnsureSuccessStatusCode();
            var d = await resp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
            return d!["patientId"].GetInt32();
        }

        var id1 = await Scan();
        var id2 = await Scan();
        Assert.Equal(id1, id2);
    }

    // ── Triage color update ────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateTriageColor_SetsColorOnPatient()
    {
        var token = await GetAdminTokenAsync();
        var patientId = await CreatePatientAsync(token);

        var request = new HttpRequestMessage(
            HttpMethod.Post, $"/api/persons/{patientId}/update-triage-color")
        {
            Content = JsonContent.Create(new
            {
                triageColor = "grün",
                lat = 48.1234,
                lng = 16.5678
            })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.Equal("grün", data!["triagefarbe"].GetString());
        Assert.Equal(patientId, data["idpatient"].GetInt32());
    }

    [Fact]
    public async Task UpdateTriageColor_UnknownPatient_Returns404()
    {
        var token = await GetAdminTokenAsync();

        var request = new HttpRequestMessage(
            HttpMethod.Post, "/api/persons/999999/update-triage-color")
        {
            Content = JsonContent.Create(new { triageColor = "rot" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    // ── Respiration update ─────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateRespiration_SetsAtmungOnPatient()
    {
        var token = await GetAdminTokenAsync();
        var patientId = await CreatePatientAsync(token);

        var request = new HttpRequestMessage(
            HttpMethod.Post, $"/api/persons/{patientId}/respiration")
        {
            Content = JsonContent.Create(new { respiration = "true", lat = 48.0, lng = 16.0 })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    // ── Persons list ───────────────────────────────────────────────────────────

    [Fact]
    public async Task GetPersons_ReturnsPatientListForScene()
    {
        var token = await GetAdminTokenAsync();
        var qrCode = await GeneratePatientQrCodeAsync(token);
        var scene = await CreateOperationSceneAsync(token);
        var sceneJson = JsonSerializer.Serialize(scene);
        await ScanPatientAsync(token, qrCode, sceneJson);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/persons")
        {
            Content = JsonContent.Create(new { operationScene = sceneJson })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var patients = await response.Content.ReadFromJsonAsync<List<Dictionary<string, JsonElement>>>();
        Assert.NotNull(patients);
        Assert.NotEmpty(patients);
        // Verify response shape matches frontend contract
        Assert.True(patients[0].ContainsKey("idpatient"));
        Assert.True(patients[0].ContainsKey("triagefarbe"));
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private async Task<string> GetAdminTokenAsync()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        return data!["token"].ToString()!;
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

    private async Task<Dictionary<string, JsonElement>> CreateOperationSceneAsync(string token)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "Test Scene", description = "Integration test" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return data!["operactionScene"].Deserialize<Dictionary<string, JsonElement>>()!;
    }

    private async Task<int> CreatePatientAsync(string token)
    {
        var qrCode = await GeneratePatientQrCodeAsync(token);
        var scene = await CreateOperationSceneAsync(token);
        var sceneJson = JsonSerializer.Serialize(scene);
        return await ScanPatientAsync(token, qrCode, sceneJson);
    }

    private async Task<int> ScanPatientAsync(string token, string qrCode, string sceneJson)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/verify-patient-qr-code")
        {
            Content = JsonContent.Create(new { qr_code = qrCode, operationScene = sceneJson })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return data!["patientId"].GetInt32();
    }
}
