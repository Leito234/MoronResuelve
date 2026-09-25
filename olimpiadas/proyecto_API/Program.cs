using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using MoronResuelve.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ══════════════════════════════════════
// 1. Base de datos PostgreSQL
// ══════════════════════════════════════
builder.Services.AddDbContext<MoronResuelveContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ══════════════════════════════════════
// 2. Autenticación JWT
// ══════════════════════════════════════
var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey))
            };
    });

builder.Services.AddAuthorization();

// ══════════════════════════════════════
// 3. Controladores + JSON camelCase
// ══════════════════════════════════════
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // camelCase por defecto (coincide con las propiedades del frontend)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

        // Serializar enums como string
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));

        // Ignorar propiedades null (como iconFilled cuando es false)
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;
    });

// ══════════════════════════════════════
// 4. CORS – Permitir frontend y entornos de prueba
// ══════════════════════════════════════
builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy.SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

// ══════════════════════════════════════
// 5. Swagger / OpenAPI
// ══════════════════════════════════════
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Morón Resuelve API",
        Version = "v1",
        Description = "API REST para la plataforma de gestión de incidencias urbanas del Municipio de Morón."
    });
});

var app = builder.Build();

// ══════════════════════════════════════
// 6. Swagger habilitado siempre (dev + prod)
// ══════════════════════════════════════
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Morón Resuelve API v1");
    options.RoutePrefix = "swagger";
});

// ══════════════════════════════════════
// 7. Migración automática al iniciar
// ══════════════════════════════════════
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<MoronResuelveContext>();

    db.Database.Migrate();

    var passHash = BCrypt.Net.BCrypt.HashPassword("password123");

    // Semilla oficial del inspector municipal
    var inspector = db.Usuarios.FirstOrDefault(u => u.Email == "operaciones@moron.gob.ar");
    if (inspector == null)
    {
        db.Usuarios.Add(new MoronResuelve.Api.Models.Usuario
        {
            Nombre = "Operaciones Municipales Morón",
            Email = "operaciones@moron.gob.ar",
            PasswordHash = passHash,
            Telefono = "11-4489-7777",
            Localidad = "Morón Centro",
            Nivel = 10,
            Puntos = 5000,
            EstaVerificado = true,
            Rol = MoronResuelve.Api.Models.Enums.RolUsuario.Inspector,
            FechaRegistro = DateTime.UtcNow
        });
    }
    else
    {
        inspector.PasswordHash = passHash;
        inspector.Rol = MoronResuelve.Api.Models.Enums.RolUsuario.Inspector;
    }

    // Semilla oficial del administrador municipal
    var admin = db.Usuarios.FirstOrDefault(u => u.Email == "admin@moron.gob.ar");
    if (admin == null)
    {
        db.Usuarios.Add(new MoronResuelve.Api.Models.Usuario
        {
            Nombre = "Administrador Municipal Morón",
            Email = "admin@moron.gob.ar",
            PasswordHash = passHash,
            Telefono = "11-4489-7777",
            Localidad = "Morón Centro",
            Nivel = 10,
            Puntos = 5000,
            EstaVerificado = true,
            Rol = MoronResuelve.Api.Models.Enums.RolUsuario.Admin,
            FechaRegistro = DateTime.UtcNow
        });
    }
    else
    {
        admin.PasswordHash = passHash;
        admin.Rol = MoronResuelve.Api.Models.Enums.RolUsuario.Admin;
    }

    // Semilla del vecino demo
    var vecino = db.Usuarios.FirstOrDefault(u => u.Email == "al_garcia@eest6.edu.ar");
    if (vecino != null)
    {
        vecino.PasswordHash = passHash;
        vecino.Rol = MoronResuelve.Api.Models.Enums.RolUsuario.Vecino;
    }

    db.SaveChanges();
}

// ══════════════════════════════════════
// 8. Middleware pipeline
// ══════════════════════════════════════
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();