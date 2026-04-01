using System.Diagnostics;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using PLS.Api.Data;
using PLS.Api.Extensions;
using PLS.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));
builder.Services.Configure<BootstrapSettings>(builder.Configuration.GetSection("Bootstrap"));

// Database
builder.Services.AddDbContext<PlsDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0)),
        mysql => mysql.UseNetTopologySuite()));

// Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Authorization policies
// AdminOnly  — requires JWT type claim == "admin"
// QrOrAdmin  — requires JWT type claim == "admin" or "qr"
// TriageWrite — same claim set as QrOrAdmin; user role receives "qr" type token,
//               making it indistinguishable at this layer — intentional for testing phase.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("type", "admin"));

    options.AddPolicy("QrOrAdmin", policy =>
        policy.RequireClaim("type", "admin", "qr"));

    options.AddPolicy("TriageWrite", policy =>
        policy.RequireClaim("type", "admin", "qr"));
});

// Rate limiting — auth endpoints: 10 attempts per 60 s per IP.
// Exceeding the limit returns 429 Too Many Requests.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("auth", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(60),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

// Health checks — DB connectivity and MQTT broker state
builder.Services.AddHealthChecks()
    .AddDbContextCheck<PlsDbContext>("database")
    .AddCheck<MqttHealthCheck>("mqtt", tags: ["ready"]);

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<MetricsService>();
builder.Services.AddSingleton<MqttPublishService>();
builder.Services.AddSingleton<IMqttPublishService>(sp => sp.GetRequiredService<MqttPublishService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<MqttPublishService>());
builder.Services.AddSingleton<MqttHealthCheck>();

// Controllers + JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Preserve exact casing
    });

// Swagger (dev only)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS — dev allows Vite dev server; production allows origins from PLS_ALLOWED_ORIGINS env var.
// PLS_ALLOWED_ORIGINS should be a comma-separated list, e.g. "https://pls.example.com"
var allowedOrigins = (Environment.GetEnvironmentVariable("PLS_ALLOWED_ORIGINS") ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());

    options.AddPolicy("ProdCors", policy =>
    {
        if (allowedOrigins.Length > 0)
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        else
            policy.SetIsOriginAllowed(_ => false); // deny all cross-origin if not configured
    });
});

var app = builder.Build();

// Resolve bootstrap credentials from configuration.
// In production, Bootstrap:AdminPassword must be set — no insecure default is allowed.
var bootstrap = app.Configuration.GetSection("Bootstrap").Get<BootstrapSettings>() ?? new BootstrapSettings();
var adminUsername = bootstrap.AdminUsername;
var adminPassword = bootstrap.AdminPassword;
if (app.Environment.IsProduction() && string.IsNullOrEmpty(adminPassword))
    throw new InvalidOperationException(
        "Bootstrap:AdminPassword must be configured in production. Startup aborted.");
adminPassword ??= "admin"; // dev/test fallback — never used in production

// Testing/presentation user — configurable, retained until production launch.
var testUserUsername = bootstrap.TestUserUsername;
var testUserPassword = bootstrap.TestUserPassword;

// ── Migration and seeding ────────────────────────────────────────────────────
// PLS_MIGRATE_ONLY=true: run migrations + seed, then exit (used by the db-migrate compose service).
// Normal startup: seed only — migrations must have been applied by the migration job.
// Development/test: set PLS_AUTO_MIGRATE=true to run migrations inline (convenience only).
var migrateOnly = Environment.GetEnvironmentVariable("PLS_MIGRATE_ONLY") == "true";
var autoMigrate = migrateOnly || Environment.GetEnvironmentVariable("PLS_AUTO_MIGRATE") == "true"
                              || app.Environment.IsDevelopment();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PlsDbContext>();

    if (autoMigrate)
        await db.Database.MigrateAsync();

    await DataSeeder.SeedAsync(db, adminUsername, adminPassword, testUserUsername, testUserPassword);
}

// Migrate-only mode: exit after migrations + seeding (no web server started).
if (migrateOnly)
{
    Console.WriteLine("Migration completed successfully. Exiting.");
    return;
}

// Correlation ID — propagate X-Request-ID from callers or generate a new one.
// The ID is echoed in the response and injected into the log scope so every log
// line for a request carries the same correlation ID.
app.Use(async (context, next) =>
{
    var requestId = context.Request.Headers["X-Request-ID"].FirstOrDefault()
                    ?? Activity.Current?.TraceId.ToString()
                    ?? Guid.NewGuid().ToString("N");

    context.Items["RequestId"] = requestId;
    context.Response.Headers["X-Request-ID"] = requestId;

    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    context.RequestServices.GetRequiredService<MetricsService>().IncrementRequests();

    using (logger.BeginScope(new Dictionary<string, object> { ["RequestId"] = requestId }))
    {
        await next();
    }
});

// Security headers on every response
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";

    if (app.Environment.IsProduction())
        context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";

    await next();
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}
else
{
    app.UseCors("ProdCors");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseRateLimiter();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

// Needed by WebApplicationFactory in integration tests
public partial class Program { }
