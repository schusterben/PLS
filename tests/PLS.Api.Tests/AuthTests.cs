using System.Net;
using System.Net.Http.Json;

namespace PLS.Api.Tests;

[Collection("Integration")]
public class AuthTests
{
    private readonly HttpClient _client;

    public AuthTests(PlsWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    // ── Admin login ────────────────────────────────────────────────────────────

    [Fact]
    public async Task AdminLogin_WithTestCredentials_ReturnsSuccessAndToken()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });

        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();

        Assert.NotNull(data);
        Assert.Equal("success", data["status"].ToString()!.ToLower());
        Assert.True(data.ContainsKey("token"));
        Assert.NotEmpty(data["token"].ToString()!);
    }

    [Fact]
    public async Task AdminLogin_WithWrongPassword_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = "admin", password = "wrongpassword" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminLogin_WithUnknownUser_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = "nobody", password = "anything" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── QR login ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task QrLogin_WithUnknownCode_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/qr-login",
            new { qr_code = "this-qr-code-does-not-exist" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Token validation ───────────────────────────────────────────────────────

    [Fact]
    public async Task ValidateToken_WithValidAdminToken_ReturnsIsValid()
    {
        var token = await GetAdminTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/validate-token");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(data);
        Assert.Equal("true", data["isValid"].ToString()!.ToLower());
    }

    [Fact]
    public async Task ValidateToken_WithoutToken_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/validate-token", new { });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    internal async Task<string> GetAdminTokenAsync()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        return data!["token"].ToString()!;
    }
}
