using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PLS.Api.Data;
using PLS.Api.Models.DTOs;
using PLS.Api.Models.Entities;

namespace PLS.Api.Controllers;

[ApiController]
public class OperationSceneController : ControllerBase
{
    private readonly PlsDbContext _context;

    public OperationSceneController(PlsDbContext context)
    {
        _context = context;
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("api/createOperationScene")]
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

        // IMPORTANT: typo in key "operactionScene" is intentional — matches frontend
        return Ok(new
        {
            status = "success",
            operactionScene = new
            {
                idoperationScene = operationScene.Id,
                name = operationScene.Name,
                description = operationScene.Description,
                created_at = operationScene.CreatedAt,
                updated_at = operationScene.UpdatedAt
            }
        });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("api/deleteOperationScene/{id}")]
    public async Task<IActionResult> DeleteOperationScene(int id)
    {
        var operationScene = await _context.OperationScenes.FindAsync(id);
        if (operationScene == null)
            return NotFound(new { status = "error", message = "Einsatzort nicht gefunden" });

        _context.OperationScenes.Remove(operationScene);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success" });
    }

    [Authorize(Policy = "QrOrAdmin")]
    [HttpGet("api/getAllCurrentOperationScenes")]
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
}
