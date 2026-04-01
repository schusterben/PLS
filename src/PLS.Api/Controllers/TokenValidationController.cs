using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PLS.Api.Controllers;

[ApiController]
public class TokenValidationController : ControllerBase
{
    [Authorize]
    [HttpPost("api/validate-token")]
    public IActionResult ValidateToken()
    {
        return Ok(new { isValid = true });
    }
}
