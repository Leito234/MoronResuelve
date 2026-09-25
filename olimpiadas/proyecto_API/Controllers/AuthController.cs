using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MoronResuelve.Api.Data;
using MoronResuelve.Api.DTOs;
using MoronResuelve.Api.Models;
using MoronResuelve.Api.Models.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MoronResuelve.Api.Controllers;

/// <summary>
/// Controlador de autenticación: registro y login.
/// 
/// Endpoints:
///   POST /api/auth/registro → Registra un nuevo usuario
///   POST /api/auth/login    → Inicia sesión y devuelve JWT + perfil
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MoronResuelveContext _context;
    private readonly IConfiguration _config;

    public AuthController(MoronResuelveContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // ────────────────────────────────────
    // POST /api/auth/registro
    // ────────────────────────────────────
    [HttpPost("registro")]
    public async Task<ActionResult<LoginRespuestaDto>> Registro([FromBody] RegistroUsuarioDto dto)
    {
        // Verificar que el email no exista
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            return Conflict(new { message = "Ya existe un usuario registrado con ese email." });

        var usuario = new Usuario
        {
            Nombre = $"{dto.Nombre} {dto.Apellido}".Trim(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Telefono = !string.IsNullOrEmpty(dto.Telefono) ? $"+54 9 11 {dto.Telefono}" : "11-2345-6789",
            Localidad = !string.IsNullOrEmpty(dto.Localidad) ? dto.Localidad : "Morón Centro",
            Nivel = 1,
            Puntos = 100,
            EstaVerificado = true,
            Rol = RolUsuario.Vecino,
            FechaRegistro = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var token = GenerarJwt(usuario);
        return CreatedAtAction(nameof(Registro), new LoginRespuestaDto
        {
            Token = token,
            Usuario = MapToPerfilDto(usuario)
        });
    }

    // ────────────────────────────────────
    // POST /api/auth/login
    // ────────────────────────────────────
    [HttpPost("login")]
    public async Task<ActionResult<LoginRespuestaDto>> Login([FromBody] LoginDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null)
            return Unauthorized(new { message = "Email o contraseña incorrectos." });

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return Unauthorized(new { message = "Email o contraseña incorrectos." });

        // Determinar rol por dominio del email (como el frontend)
        if (dto.Email.Contains("@moron.gob.ar"))
            usuario.Rol = RolUsuario.Inspector;

        var token = GenerarJwt(usuario);
        return Ok(new LoginRespuestaDto
        {
            Token = token,
            Usuario = MapToPerfilDto(usuario)
        });
    }

    // ════════════════════════════════════
    // Helpers privados
    // ════════════════════════════════════

    private string GenerarJwt(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Nombre),
            new Claim(ClaimTypes.Role, usuario.Rol.ToString().ToLower())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UsuarioPerfilDto MapToPerfilDto(Usuario u) => new()
    {
        Name = u.Nombre,
        Email = u.Email,
        Phone = u.Telefono,
        Locality = u.Localidad,
        Level = u.Nivel,
        Points = u.Puntos,
        IsVerified = u.EstaVerificado,
        Role = u.Rol.ToString().ToLower()
    };
}
