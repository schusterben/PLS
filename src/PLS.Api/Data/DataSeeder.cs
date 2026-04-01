using Microsoft.EntityFrameworkCore;
using PLS.Api.Models.Entities;

namespace PLS.Api.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(
        PlsDbContext context,
        string adminUsername,
        string adminPassword,
        string testUserUsername,
        string testUserPassword)
    {
        if (!await context.Users.AnyAsync())
        {
            context.Users.AddRange(
                new User
                {
                    Username = adminUsername,
                    Password = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    AdminRole = true,
                    RequiresPasswordChange = true
                },
                new User
                {
                    // Testing/presentation account — retained until production launch.
                    // Configurable via Bootstrap:TestUserUsername / Bootstrap:TestUserPassword.
                    Username = testUserUsername,
                    Password = BCrypt.Net.BCrypt.HashPassword(testUserPassword),
                    AdminRole = false,
                    RequiresPasswordChange = false
                }
            );
            await context.SaveChangesAsync();
        }
    }
}
