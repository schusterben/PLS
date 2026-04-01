using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PLS.Api.Data;
using PLS.Api.Models.DTOs;
using PLS.Api.Models.Entities;

namespace PLS.Api.Controllers;

/// <summary>
/// Task 53: Clean v2 operation scene endpoints.
/// Differences from v1 (OperationSceneController):
///  - Response key is "operationScene" (correct spelling).
///    v1 uses "operactionScene" (intentional typo for frontend compatibility).
/// </summary>
[ApiController]
public class OperationSceneV2Controller : ControllerBase
{
    private readonly PlsDbContext _context;

    public OperationSceneV2Controller(PlsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Creates or updates an operation scene.
    /// Response uses "operationScene" (correct spelling, unlike v1's "operactionScene").
    /// </summary>
    [Authorize(Policy = "AdminOnly")]
    [HttpPost("api/v2/createOperationScene")]
    public async Task<IActionResult> CreateOperationScene([FromBody] CreateOperationSceneRequest request)
    {
        OperationScene operationScene;

        if (request.id.HasValue)
        {
            operationScene = await _context.OperationScenes.FindAsync(request.id.Value)
                ?? new OperationScene();
            if (operationScene.Id == 0)
                _context.OperationScenes.Add(operationScene);
        }
        else
        {
            operationScene = new OperationScene();
            _context.OperationScenes.Add(operationScene);
        }

        operationScene.Name = request.name;
        operationScene.Description = request.description;
        await _context.SaveChangesAsync();

        // v2: correctly spelled "operationScene" key (v1 has "operactionScene" typo)
        return Ok(new
        {
            status = "success",
            operationScene = new
            {
                idoperationScene = operationScene.Id,
                name = operationScene.Name,
                description = operationScene.Description,
                created_at = operationScene.CreatedAt,
                updated_at = operationScene.UpdatedAt
            }
        });
    }

    /// <summary>Returns operation scenes updated in the last 20 days.</summary>
    [Authorize(Policy = "QrOrAdmin")]
    [HttpGet("api/v2/getAllCurrentOperationScenes")]
    public async Task<IActionResult> GetAllCurrentOperationScenes()
    {
        var twentyDaysAgo = DateTime.UtcNow.AddDays(-20);

        var scenes = await _context.OperationScenes
            .Where(s => s.UpdatedAt >= twentyDaysAgo)
            .Select(s => new
            {
                idoperationScene = s.Id,
                name = s.Name,
                description = s.Description,
                created_at = s.CreatedAt,
                updated_at = s.UpdatedAt
            })
            .ToListAsync();

        return Ok(scenes);
    }

    /// <summary>Deletes an operation scene by ID.</summary>
    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("api/v2/deleteOperationScene/{id}")]
    public async Task<IActionResult> DeleteOperationScene(int id)
    {
        var operationScene = await _context.OperationScenes.FindAsync(id);
        if (operationScene == null)
            return NotFound(new { status = "error", message = "Einsatzort nicht gefunden" });

        _context.OperationScenes.Remove(operationScene);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success" });
    }
}
