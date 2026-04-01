using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace PLS.Api.Tests;

/// <summary>
/// Task 56: Authorization and Security Test Suite.
/// Validates policy enforcement (AdminOnly, TriageWrite) across protected endpoints:
///  - Negative-path assertions: QR/user tokens denied on AdminOnly endpoints (403)
///  - Unauthenticated denial (401) on all protected endpoints
///  - Positive-path assertions: admin tokens pass AdminOnly, all three token types pass TriageWrite
///  - Refresh token flow: valid token rotates and returns new pair
///  - Revocation: after logout the refresh token is rejected
/// </summary>
[Collection("Integration")]
public class AuthorizationTests
{
    private readonly PlsWebAppFactory _factory;
    private readonly HttpClient _client;

    // Cached within the test-class instance (xUnit runs tests in a class sequentially).
    private string? _cachedAdminToken;
    private string? _cachedQrToken;
    private string? _cachedUserToken;

    public AuthorizationTests(PlsWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // ── AdminOnly: unauthenticated → 401 ──────────────────────────────────────

    [Theory]
    [InlineData("GET", "api/getAllCurrentOperationScenes")]
    [InlineData("GET", "api/getLoginQrCodes")]
    [InlineData("GET", "api/getUnusedPatientQrCodes")]
    [InlineData("GET", "api/test-db")]
    public async Task AdminOnlyEndpoint_WithNoToken_Returns401(string method, string url)
    {
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── AdminOnly: QR token → 403 ─────────────────────────────────────────────

    [Theory]
    [InlineData("GET", "api/getLoginQrCodes")]
    [InlineData("GET", "api/getUnusedPatientQrCodes")]
    [InlineData("GET", "api/test-db")]
    public async Task AdminOnlyEndpoint_WithQrToken_Returns403(string method, string url)
    {
        var token = await GetQrTokenAsync();
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── AdminOnly: user token → 403 ───────────────────────────────────────────
    // User tokens carry type="qr" by design (testing accommodation, see Decisions table).
    // They therefore cannot satisfy the AdminOnly policy.

    [Theory]
    [InlineData("GET", "api/getLoginQrCodes")]
    [InlineData("GET", "api/getUnusedPatientQrCodes")]
    [InlineData("GET", "api/test-db")]
    public async Task AdminOnlyEndpoint_WithUserToken_Returns403(string method, string url)
    {
        var token = await GetUserTokenAsync();
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── AdminOnly: admin token → passes authorization ──────────────────────────

    [Theory]
    [InlineData("GET", "api/getAllCurrentOperationScenes")]
    [InlineData("GET", "api/getLoginQrCodes")]
    [InlineData("GET", "api/getUnusedPatientQrCodes")]
    [InlineData("GET", "api/test-db")]
    public async Task AdminOnlyEndpoint_WithAdminToken_IsNotDenied(string method, string url)
    {
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── TriageWrite: unauthenticated → 401 ────────────────────────────────────

    [Fact]
    public async Task TriageWriteEndpoint_WithNoToken_Returns401_GetBodyParts()
    {
        var response = await _client.GetAsync("api/get-body-parts?idpatient=1");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task TriageWriteEndpoint_WithNoToken_Returns401_PostPersons()
    {
        var response = await _client.PostAsJsonAsync("api/persons", new { operationScene = "{}" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── QrOrAdmin: unauthenticated → 401 ─────────────────────────────────────

    [Fact]
    public async Task QrOrAdminEndpoint_WithNoToken_Returns401_DevUnusedPatientQrCodes()
    {
        var response = await _client.GetAsync("api/dev/unusedPatientQrCodes");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── QrOrAdmin: qr/user/admin tokens are authorized (may return 404) ─────

    [Fact]
    public async Task QrOrAdminEndpoint_WithQrToken_IsNotDenied_DevUnusedPatientQrCodes()
    {
        var token = await GetQrTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/dev/unusedPatientQrCodes");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task QrOrAdminEndpoint_WithUserToken_IsNotDenied_DevUnusedPatientQrCodes()
    {
        var token = await GetUserTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/dev/unusedPatientQrCodes");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task QrOrAdminEndpoint_WithAdminToken_IsNotDenied_DevUnusedPatientQrCodes()
    {
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/dev/unusedPatientQrCodes");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── TriageWrite: QR token → authorized (business logic may return 4xx) ────

    [Fact]
    public async Task TriageWriteEndpoint_WithQrToken_IsNotDenied()
    {
        var token = await GetQrTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/get-body-parts?idpatient=99999");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── TriageWrite: user token → authorized ──────────────────────────────────

    [Fact]
    public async Task TriageWriteEndpoint_WithUserToken_IsNotDenied()
    {
        var token = await GetUserTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/get-body-parts?idpatient=99999");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── TriageWrite: admin token → authorized ─────────────────────────────────

    [Fact]
    public async Task TriageWriteEndpoint_WithAdminToken_IsNotDenied()
    {
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "api/get-body-parts?idpatient=99999");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── Refresh token: valid token → new access + refresh tokens ──────────────

    [Fact]
    public async Task RefreshToken_WithValidAdminRefreshToken_ReturnsNewTokens()
    {
        var (_, refreshToken) = await FreshAdminLoginAsync();

        var response = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken });

        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        Assert.Equal("success", data["status"].GetString());
        Assert.True(data.ContainsKey("token"));
        Assert.True(data.ContainsKey("refreshToken"));
        Assert.NotEmpty(data["token"].GetString()!);
        Assert.NotEmpty(data["refreshToken"].GetString()!);
    }

    [Fact]
    public async Task RefreshToken_WithValidUserRefreshToken_ReturnsNewTokens()
    {
        var (_, refreshToken) = await FreshUserLoginAsync();

        var response = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken });

        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        Assert.Equal("success", data["status"].GetString());
        Assert.NotEmpty(data["token"].GetString()!);
    }

    // ── Refresh token: bogus token → 401 ─────────────────────────────────────

    [Fact]
    public async Task RefreshToken_WithInvalidToken_Returns401()
    {
        var response = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken = "this-is-not-a-valid-refresh-token" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Revocation: logout invalidates the refresh token ─────────────────────

    [Fact]
    public async Task Logout_ThenRefreshToken_Returns401()
    {
        var (accessToken, refreshToken) = await FreshAdminLoginAsync();

        // Logout using the access token, passing the refresh token to revoke
        var logoutRequest = new HttpRequestMessage(HttpMethod.Post, "api/logout")
        {
            Content = JsonContent.Create(new { refreshToken })
        };
        logoutRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var logoutResponse = await _client.SendAsync(logoutRequest);
        logoutResponse.EnsureSuccessStatusCode();

        // Revoked refresh token must now be rejected
        var refreshResponse = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken });
        Assert.Equal(HttpStatusCode.Unauthorized, refreshResponse.StatusCode);
    }

    // ── Refresh token rotation: used token cannot be replayed ─────────────────

    [Fact]
    public async Task RefreshToken_AfterRotation_OldTokenIsRejected()
    {
        var (_, originalRefreshToken) = await FreshAdminLoginAsync();

        // First refresh — rotates the token
        var firstRefresh = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken = originalRefreshToken });
        firstRefresh.EnsureSuccessStatusCode();

        // Replaying the original refresh token must fail
        var replayResponse = await _client.PostAsJsonAsync("api/refresh-token",
            new { refreshToken = originalRefreshToken });
        Assert.Equal(HttpStatusCode.Unauthorized, replayResponse.StatusCode);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private async Task<string> GetAdminTokenAsync()
    {
        if (_cachedAdminToken != null) return _cachedAdminToken;
        var (token, _) = await FreshAdminLoginAsync();
        _cachedAdminToken = token;
        return token;
    }

    private async Task<string> GetUserTokenAsync()
    {
        if (_cachedUserToken != null) return _cachedUserToken;
        var (token, _) = await FreshUserLoginAsync();
        _cachedUserToken = token;
        return token;
    }

    private async Task<string> GetQrTokenAsync()
    {
        if (_cachedQrToken != null) return _cachedQrToken;

        // Generate a fresh login QR code via the admin endpoint
        var adminToken = await GetAdminTokenAsync();
        var genRequest = new HttpRequestMessage(HttpMethod.Post, "api/generateLoginQRCodes")
        {
            Content = JsonContent.Create(new { number = 1 })
        };
        genRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);
        var genResponse = await _client.SendAsync(genRequest);
        genResponse.EnsureSuccessStatusCode();

        var genData = await genResponse.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        var qrCode = genData!["qrcodes"][0].GetString()!;

        // Authenticate with the generated QR code
        var loginResponse = await _client.PostAsJsonAsync("api/qr-login", new { qr_code = qrCode });
        loginResponse.EnsureSuccessStatusCode();
        var loginData = await loginResponse.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        _cachedQrToken = loginData!["token"].GetString()!;
        return _cachedQrToken;
    }

    /// <summary>Returns a fresh access+refresh token pair for the test admin (not cached).</summary>
    private async Task<(string accessToken, string refreshToken)> FreshAdminLoginAsync()
    {
        var response = await _client.PostAsJsonAsync("api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return (data!["token"].GetString()!, data["refreshToken"].GetString()!);
    }

    /// <summary>Returns a fresh access+refresh token pair for the test user (not cached).</summary>
    private async Task<(string accessToken, string refreshToken)> FreshUserLoginAsync()
    {
        var response = await _client.PostAsJsonAsync("api/user-login",
            new { username = PlsWebAppFactory.TestUserUsername, password = PlsWebAppFactory.TestUserPassword });
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        return (data!["token"].GetString()!, data["refreshToken"].GetString()!);
    }
}
