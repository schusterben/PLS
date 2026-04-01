using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PLS.Api.Data;
using PLS.Api.Models.DTOs;
using PLS.Api.Models.Entities;

namespace PLS.Api.Services;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public int ExpirationInMinutes { get; set; } = 1440; // legacy — not used for new token types
    public string Issuer { get; set; } = "PLS";
    public int AdminExpirationMinutes { get; set; } = 60;
    public int QrExpirationMinutes { get; set; } = 480;
    public int UserExpirationMinutes { get; set; } = 480;
    public int RefreshTokenExpirationDays { get; set; } = 7;
}

public class AuthService : IAuthService
{
    private readonly PlsDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(PlsDbContext context, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResult?> AuthenticateQrCode(string qrCode)
    {
        var qrLogin = await _context.QrCodeLogins.FirstOrDefaultAsync(q => q.QrLogin == qrCode);
        if (qrLogin == null) return null;

        // QR tokens: subject is the QrCodeLogin ID, no user security stamp needed
        var accessToken = GenerateToken(qrLogin.Id.ToString(), "qr", null, _jwtSettings.QrExpirationMinutes);
        // QR logins don't have a user account, so we create a synthetic user-scoped refresh token
        // keyed by the QrCodeLogin ID (stored as negative UserId to avoid collision)
        // For simplicity: no refresh tokens for QR logins — they re-scan the QR code.
        return new AuthResult(accessToken, string.Empty);
    }

    public async Task<AdminAuthResult?> AuthenticateAdmin(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;
        if (!user.AdminRole) return null;

        var accessToken = GenerateToken(user.Id.ToString(), "admin", user.SecurityStamp, _jwtSettings.AdminExpirationMinutes);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);
        return new AdminAuthResult(accessToken, refreshToken, user.RequiresPasswordChange);
    }

    public async Task<AuthResult?> AuthenticateUser(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;

        // User role uses "qr" token type — intentional for testing phase (same TriageWrite access)
        var accessToken = GenerateToken(user.Id.ToString(), "qr", user.SecurityStamp, _jwtSettings.UserExpirationMinutes);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);
        return new AuthResult(accessToken, refreshToken);
    }

    public async Task<AdminAuthResult?> RefreshAdminTokenAsync(string refreshToken)
    {
        var stored = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (stored == null || stored.IsRevoked || stored.ExpiresAt < DateTime.UtcNow) return null;
        if (!stored.User.AdminRole) return null;

        // Rotate: revoke old, issue new
        stored.IsRevoked = true;
        var newRefresh = await CreateRefreshTokenAsync(stored.UserId);
        var accessToken = GenerateToken(stored.UserId.ToString(), "admin", stored.User.SecurityStamp, _jwtSettings.AdminExpirationMinutes);
        return new AdminAuthResult(accessToken, newRefresh, stored.User.RequiresPasswordChange);
    }

    public async Task<AuthResult?> RefreshTokenAsync(string refreshToken)
    {
        var stored = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (stored == null || stored.IsRevoked || stored.ExpiresAt < DateTime.UtcNow) return null;

        stored.IsRevoked = true;
        var newRefresh = await CreateRefreshTokenAsync(stored.UserId);
        var type = stored.User.AdminRole ? "admin" : "qr";
        var expiry = stored.User.AdminRole ? _jwtSettings.AdminExpirationMinutes : _jwtSettings.UserExpirationMinutes;
        var accessToken = GenerateToken(stored.UserId.ToString(), type, stored.User.SecurityStamp, expiry);
        return new AuthResult(accessToken, newRefresh);
    }

    public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
    {
        var stored = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken);
        if (stored == null || stored.IsRevoked) return false;

        stored.IsRevoked = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task RevokeAllRefreshTokensForUserAsync(int userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ToListAsync();

        foreach (var t in tokens)
            t.IsRevoked = true;

        await _context.SaveChangesAsync();
    }

    private async Task<string> CreateRefreshTokenAsync(int userId)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        _context.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        });
        await _context.SaveChangesAsync();
        return token;
    }

    private string GenerateToken(string subject, string type, string? securityStamp, int expirationMinutes)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, subject),
            new("type", type),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (securityStamp != null)
            claims.Add(new Claim("security_stamp", securityStamp));

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
