namespace PLS.Api.Models.DTOs;

public record CreateAdminUserRequest(string username, string password);
public record ChangeAdminPasswordRequest(string username, string password, string newpassword);
