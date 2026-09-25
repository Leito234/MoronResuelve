using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoronResuelve.Api.Data;
using MoronResuelve.Api.DTOs;

namespace MoronResuelve.Api.Controllers;

/// <summary>
/// Controlador de localidades del partido de Morón.
/// 
/// Endpoints:
///   GET /api/localidades → Lista las 7 localidades
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LocalidadesController : ControllerBase
{
    private readonly MoronResuelveContext _context;

    public LocalidadesController(MoronResuelveContext context)
    {
        _context = context;
    }

    // ────────────────────────────────────
    // GET /api/localidades
    // ────────────────────────────────────
    [HttpGet]
    public async Task<ActionResult<List<LocalidadDto>>> GetAll()
    {
        var localidades = await _context.Localidades
            .OrderBy(l => l.Id)
            .ToListAsync();

        return Ok(localidades.Select(l => new LocalidadDto
        {
            Id = l.SlugId,
            Name = l.Nombre
        }).ToList());
    }
}
