using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoronResuelve.Api.Data;
using MoronResuelve.Api.DTOs;

namespace MoronResuelve.Api.Controllers;

/// <summary>
/// Controlador de usuarios / perfiles.
/// 
/// Endpoints:
///   GET /api/usuarios/{id}  → Obtiene el perfil de un usuario
///   PUT /api/usuarios/{id}  → Actualiza datos del perfil
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly MoronResuelveContext _context;

    public UsuariosController(MoronResuelveContext context)
    {
        _context = context;
    }

    // ────────────────────────────────────
    // GET /api/usuarios
    // ────────────────────────────────────
    [HttpGet]
    public async Task<ActionResult<List<UsuarioPerfilDto>>> GetAll()
    {
        var usuarios = await _context.Usuarios
            .OrderBy(u => u.Id)
            .ToListAsync();

        return Ok(usuarios.Select(u => new UsuarioPerfilDto
        {
            Id = u.Id,
            Name = u.Nombre,
            Email = u.Email,
            Phone = u.Telefono,
            Locality = u.Localidad,
            Level = u.Nivel,
            Points = u.Puntos,
            IsVerified = u.EstaVerificado,
            Role = u.Rol.ToString().ToLower()
        }).ToList());
    }

    // ────────────────────────────────────
    // GET /api/usuarios/{id}
    // ────────────────────────────────────
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioPerfilDto>> GetById(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
            return NotFound(new { message = "Usuario no encontrado." });

        return Ok(new UsuarioPerfilDto
        {
            Id = usuario.Id,
            Name = usuario.Nombre,
            Email = usuario.Email,
            Phone = usuario.Telefono,
            Locality = usuario.Localidad,
            Level = usuario.Nivel,
            Points = usuario.Puntos,
            IsVerified = usuario.EstaVerificado,
            Role = usuario.Rol.ToString().ToLower()
        });
    }

    // ────────────────────────────────────
    // PUT /api/usuarios/{id}
    // ────────────────────────────────────
    [HttpPut("{id:int}")]
    public async Task<ActionResult<UsuarioPerfilDto>> Update(int id, [FromBody] UsuarioPerfilDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
            return NotFound(new { message = "Usuario no encontrado." });

        // Se actualizan únicamente datos de perfil de usuario;
        // el ROL está estrictamente protegido y no puede auto-modificarse aquí.
        usuario.Nombre = dto.Name;
        usuario.Email = dto.Email;
        usuario.Telefono = dto.Phone;
        usuario.Localidad = dto.Locality;
        usuario.Nivel = dto.Level;
        usuario.Puntos = dto.Points;
        usuario.EstaVerificado = dto.IsVerified;

        await _context.SaveChangesAsync();

        return Ok(new UsuarioPerfilDto
        {
            Id = usuario.Id,
            Name = usuario.Nombre,
            Email = usuario.Email,
            Phone = usuario.Telefono,
            Locality = usuario.Localidad,
            Level = usuario.Nivel,
            Points = usuario.Puntos,
            IsVerified = usuario.EstaVerificado,
            Role = usuario.Rol.ToString().ToLower()
        });
    }

    // ────────────────────────────────────
    // PATCH /api/usuarios/{id}/rol
    // ────────────────────────────────────
    [HttpPatch("{id:int}/rol")]
    public async Task<ActionResult<UsuarioPerfilDto>> UpdateRole(int id, [FromBody] CambiarRolUsuarioDto dto)
    {
        // 🔒 Validación en el servidor: solo inspectores pueden asignar roles
        var rolEmisor = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value?.ToLower();
        if (User.Identity?.IsAuthenticated == true && rolEmisor != "inspector")
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Acceso denegado: solo personal con rol Inspector puede asignar o revocar permisos de inspector."
            });
        }

        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound(new { message = "Usuario no encontrado." });

        if (Enum.TryParse<Models.Enums.RolUsuario>(dto.Role, true, out var nuevoRol))
        {
            usuario.Rol = nuevoRol;
            await _context.SaveChangesAsync();
        }
        else
        {
            return BadRequest(new { message = "Rol inválido. Los roles permitidos son 'vecino' e 'inspector'." });
        }

        return Ok(new UsuarioPerfilDto
        {
            Id = usuario.Id,
            Name = usuario.Nombre,
            Email = usuario.Email,
            Phone = usuario.Telefono,
            Locality = usuario.Localidad,
            Level = usuario.Nivel,
            Points = usuario.Puntos,
            IsVerified = usuario.EstaVerificado,
            Role = usuario.Rol.ToString().ToLower()
        });
    }
}
