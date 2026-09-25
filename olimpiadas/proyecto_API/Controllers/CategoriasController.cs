using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoronResuelve.Api.Data;
using MoronResuelve.Api.DTOs;

namespace MoronResuelve.Api.Controllers;

/// <summary>
/// Controlador del catálogo de categorías de incidencias.
/// 
/// Endpoints:
///   GET /api/categorias          → Lista las 20 categorías
///   GET /api/categorias/{slug}   → Obtiene una categoría por slug
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly MoronResuelveContext _context;

    public CategoriasController(MoronResuelveContext context)
    {
        _context = context;
    }

    // ────────────────────────────────────
    // GET /api/categorias
    // ────────────────────────────────────
    [HttpGet]
    public async Task<ActionResult<List<CategoriaIncidenciaDto>>> GetAll(
        [FromQuery] string? area,
        [FromQuery] string? search)
    {
        var query = _context.CategoriasIncidencias.AsQueryable();

        if (!string.IsNullOrEmpty(area) && area != "all")
            query = query.Where(c => c.Area == area);

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(c =>
                c.Titulo.ToLower().Contains(s) ||
                c.Descripcion.ToLower().Contains(s) ||
                c.Area.ToLower().Contains(s));
        }

        var categorias = await query.OrderBy(c => c.Id).ToListAsync();

        return Ok(categorias.Select(c => new CategoriaIncidenciaDto
        {
            Id = c.CodigoCategoria,
            Slug = c.Slug,
            Number = c.Numero,
            Title = c.Titulo,
            Description = c.Descripcion,
            Icon = c.Icono,
            IconFilled = c.IconoRelleno ? true : null,
            Sla = c.Sla,
            Area = c.Area,
            ColorBadgeClass = c.ClaseBadgeColor,
            IconContainerClass = c.ClaseContenedorIcono
        }).ToList());
    }

    // ────────────────────────────────────
    // GET /api/categorias/{slug}
    // ────────────────────────────────────
    [HttpGet("{slug}")]
    public async Task<ActionResult<CategoriaIncidenciaDto>> GetBySlug(string slug)
    {
        var cat = await _context.CategoriasIncidencias
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (cat == null)
            return NotFound(new { message = $"No se encontró la categoría '{slug}'." });

        return Ok(new CategoriaIncidenciaDto
        {
            Id = cat.CodigoCategoria,
            Slug = cat.Slug,
            Number = cat.Numero,
            Title = cat.Titulo,
            Description = cat.Descripcion,
            Icon = cat.Icono,
            IconFilled = cat.IconoRelleno ? true : null,
            Sla = cat.Sla,
            Area = cat.Area,
            ColorBadgeClass = cat.ClaseBadgeColor,
            IconContainerClass = cat.ClaseContenedorIcono
        });
    }
}
