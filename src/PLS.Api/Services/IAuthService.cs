using PLS.Api.Models.DTOs;

namespace PLS.Api.Services;

public interface IAuthService
{
    Task<AuthResult?> AuthenticateQrCode(string qrCode);
    Task<AdminAuthResult?> AuthenticateAdmin(string username, string password);
    Task<AuthResult?> AuthenticateUser(string username, string password);
    Task<AdminAuthResult?> RefreshAdminTokenAsync(string refreshToken);
    Task<AuthResult?> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);
    Task RevokeAllRefreshTokensForUserAsync(int userId);
}
