using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace PLS.Api.Tests;

[Collection("Integration")]
public class OperationSceneTests
{
    private readonly HttpClient _client;

    public OperationSceneTests(PlsWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateOperationScene_ReturnsSceneWithTypoKey()
    {
        var token = await GetAdminTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "Einsatzort Alpha", description = "Testbeschreibung" })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.NotNull(data);
        // Critical: the typo key "operactionScene" must be preserved (frontend depends on it)
        Assert.True(data.ContainsKey("operactionScene"),
            "Response must contain 'operactionScene' (with typo) for frontend compatibility");

        var scene = data["operactionScene"];
        Assert.Equal("Einsatzort Alpha", scene.GetProperty("name").GetString());
    }

    [Fact]
    public async Task CreateOperationScene_WithId_UpdatesExistingScene()
    {
        var token = await GetAdminTokenAsync();

        // Create initial scene
        var createReq = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "Original Name" })
        };
        createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var createResp = await _client.SendAsync(createReq);
        var createData = await createResp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        var sceneId = createData!["operactionScene"].GetProperty("idoperationScene").GetInt32();

        // Update
        var updateReq = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { id = sceneId, name = "Updated Name", description = "Neu" })
        };
        updateReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var updateResp = await _client.SendAsync(updateReq);
        updateResp.EnsureSuccessStatusCode();

        var updateData = await updateResp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.Equal("Updated Name", updateData!["operactionScene"].GetProperty("name").GetString());
        Assert.Equal(sceneId, updateData["operactionScene"].GetProperty("idoperationScene").GetInt32());
    }

    [Fact]
    public async Task GetAllCurrentOperationScenes_FiltersTo20Days()
    {
        var token = await GetAdminTokenAsync();

        // Create a scene
        var createReq = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "Recent Scene" })
        };
        createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        await _client.SendAsync(createReq);

        // Get all current scenes
        var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/getAllCurrentOperationScenes");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(getReq);
        response.EnsureSuccessStatusCode();

        var scenes = await response.Content.ReadFromJsonAsync<List<Dictionary<string, JsonElement>>>();
        Assert.NotNull(scenes);
        Assert.NotEmpty(scenes);
        // Response shape check
        Assert.True(scenes[0].ContainsKey("idoperationScene"));
        Assert.True(scenes[0].ContainsKey("name"));
    }

    [Fact]
    public async Task DeleteOperationScene_ReturnsSuccessAndRemovesScene()
    {
        var token = await GetAdminTokenAsync();

        // Create a scene to delete
        var createReq = new HttpRequestMessage(HttpMethod.Post, "/api/createOperationScene")
        {
            Content = JsonContent.Create(new { name = "Scene To Delete" })
        };
        createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var createResp = await _client.SendAsync(createReq);
        var createData = await createResp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        var sceneId = createData!["operactionScene"].GetProperty("idoperationScene").GetInt32();

        // Delete it
        var deleteReq = new HttpRequestMessage(HttpMethod.Delete, $"/api/deleteOperationScene/{sceneId}");
        deleteReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var deleteResp = await _client.SendAsync(deleteReq);
        deleteResp.EnsureSuccessStatusCode();

        var deleteData = await deleteResp.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>();
        Assert.Equal("success", deleteData!["status"].GetString());

        // Verify it's gone from the list
        var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/getAllCurrentOperationScenes");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getResp = await _client.SendAsync(getReq);
        var scenes = await getResp.Content.ReadFromJsonAsync<List<Dictionary<string, JsonElement>>>();
        Assert.DoesNotContain(scenes!, s => s["idoperationScene"].GetInt32() == sceneId);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private async Task<string> GetAdminTokenAsync()
    {
        var response = await _client.PostAsJsonAsync("/api/adminLogin",
            new { username = PlsWebAppFactory.TestAdminUsername, password = PlsWebAppFactory.TestAdminPassword });
        var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        return data!["token"].ToString()!;
    }
}
