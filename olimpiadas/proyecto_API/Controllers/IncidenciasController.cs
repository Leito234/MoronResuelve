using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoronResuelve.Api.Data;
using MoronResuelve.Api.DTOs;
using MoronResuelve.Api.Models;
using MoronResuelve.Api.Models.Enums;

namespace MoronResuelve.Api.Controllers;

/// <summary>
/// Controlador principal de incidencias urbanas.
/// Expone los endpoints CRUD que el frontend consume.
/// 
/// Endpoints:
///   GET    /api/incidencias           → Lista todas las incidencias
///   GET    /api/incidencias/{codigo}  → Obtiene una por código (ej: MOR-4821)
///   POST   /api/incidencias           → Crea una nueva incidencia
///   PUT    /api/incidencias/{codigo}  → Actualiza estado/cuadrilla/notas
///   DELETE /api/incidencias/{codigo}  → Elimina una incidencia
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class IncidenciasController : ControllerBase
{
    private readonly MoronResuelveContext _context;

    public IncidenciasController(MoronResuelveContext context)
    {
        _context = context;
    }

    // ────────────────────────────────────
    // GET /api/incidencias
    // ────────────────────────────────────
    [HttpGet]
    public async Task<ActionResult<List<IncidenciaDto>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? area,
        [FromQuery] string? search,
        [FromQuery] bool includeSensitive = false)
    {
        if (includeSensitive && !EsAdminOInspector())
        {
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized(new { message = "Autenticación requerida para acceder a datos sensibles de incidencias." });

            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Acceso denegado: solo el personal con rol de Administrador o Inspector puede solicitar datos sensibles de los reclamos."
            });
        }

        var query = _context.Incidencias
            .Include(i => i.Imagenes)
            .Include(i => i.LineaTiempo)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            if (Enum.TryParse<EstadoIncidencia>(status, true, out var estadoEnum))
                query = query.Where(i => i.Estado == estadoEnum);
        }

        if (!string.IsNullOrEmpty(area) && area != "all")
        {
            if (Enum.TryParse<AreaIncidencia>(area, true, out var areaEnum))
                query = query.Where(i => i.Area == areaEnum);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(i =>
                i.Codigo.ToLower().Contains(s) ||
                i.Titulo.ToLower().Contains(s) ||
                i.ReportadoPor.ToLower().Contains(s) ||
                i.Ubicacion.ToLower().Contains(s));
        }

        var incidencias = await query
            .OrderByDescending(i => i.FechaCreacion)
            .ToListAsync();

        var esAdmin = EsAdminOInspector();
        return Ok(incidencias.Select(i => MapToDto(i, esAdmin)).ToList());
    }

    // ────────────────────────────────────
    // GET /api/incidencias/gestion
    // ────────────────────────────────────
    [HttpGet("gestion")]
    public async Task<ActionResult<List<IncidenciaDto>>> GetGestionMunicipal(
        [FromQuery] string? status,
        [FromQuery] string? area,
        [FromQuery] string? search)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized(new { message = "Autenticación requerida para acceder al panel de gestión municipal." });

        if (!EsAdminOInspector())
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Acceso denegado: se requieren permisos de Administrador o Inspector Municipal para acceder a la gestión operativa."
            });

        var query = _context.Incidencias
            .Include(i => i.Imagenes)
            .Include(i => i.LineaTiempo)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            if (Enum.TryParse<EstadoIncidencia>(status, true, out var estadoEnum))
                query = query.Where(i => i.Estado == estadoEnum);
        }

        if (!string.IsNullOrEmpty(area) && area != "all")
        {
            if (Enum.TryParse<AreaIncidencia>(area, true, out var areaEnum))
                query = query.Where(i => i.Area == areaEnum);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(i =>
                i.Codigo.ToLower().Contains(s) ||
                i.Titulo.ToLower().Contains(s) ||
                i.ReportadoPor.ToLower().Contains(s) ||
                i.Ubicacion.ToLower().Contains(s));
        }

        var incidencias = await query
            .OrderByDescending(i => i.FechaCreacion)
            .ToListAsync();

        return Ok(incidencias.Select(i => MapToDto(i, esAdmin: true)).ToList());
    }

    // ────────────────────────────────────
    // GET /api/incidencias/{codigo}
    // ────────────────────────────────────
    [HttpGet("{codigo}")]
    public async Task<ActionResult<IncidenciaDto>> GetByCodigo(string codigo)
    {
        var incidencia = await _context.Incidencias
            .Include(i => i.Imagenes)
            .Include(i => i.LineaTiempo)
            .FirstOrDefaultAsync(i => i.Codigo == codigo);

        if (incidencia == null)
            return NotFound(new { message = $"No se encontró la incidencia con código '{codigo}'." });

        var esAdmin = EsAdminOInspector();
        return Ok(MapToDto(incidencia, esAdmin));
    }

    // ────────────────────────────────────
    // POST /api/incidencias
    // ────────────────────────────────────
    [HttpPost]
    public async Task<ActionResult<IncidenciaDto>> Create([FromBody] CrearIncidenciaDto dto)
    {
        // Generar código único tipo MOR-XXXX
        var random = new Random();
        var codigo = $"MOR-{random.Next(1000, 9999)}";

        // Asegurar unicidad
        while (await _context.Incidencias.AnyAsync(i => i.Codigo == codigo))
            codigo = $"MOR-{random.Next(1000, 9999)}";

        // Parsear el área
        Enum.TryParse<AreaIncidencia>(dto.Area, true, out var areaEnum);

        // Parsear urgencia (manejar "Alto/Riesgo" → AltoRiesgo)
        var urgenciaEnum = dto.Urgency switch
        {
            "Alto/Riesgo" => NivelUrgencia.AltoRiesgo,
            "Medio" => NivelUrgencia.Medio,
            _ => NivelUrgencia.Bajo
        };

        var incidencia = new Incidencia
        {
            Codigo = codigo,
            Titulo = dto.Title,
            Categoria = dto.Category,
            CategoriaSlug = dto.CategorySlug,
            Area = areaEnum,
            Descripcion = dto.Description,
            Ubicacion = dto.Location,
            Localidad = dto.Locality,
            Latitud = dto.Lat,
            Longitud = dto.Lng,
            Estado = EstadoIncidencia.Pendiente,
            Urgencia = urgenciaEnum,
            TiempoTranscurrido = "Recién",
            ReportadoPor = dto.ReportedBy,
            EmailReportante = dto.ReporterEmail,
            TelefonoReportante = dto.ReporterPhone,
            CuadrillaAsignada = dto.AssignedCuadrilla,
            FechaCreacion = DateTime.UtcNow,
            Imagenes = dto.Images.Select(url => new ImagenIncidencia { Url = url }).ToList(),
            LineaTiempo = new LineaTiempo
            {
                RecibidoEn = DateTime.Now.ToString("HH:mm") + " hs",
                RevisadoEn = "Pendiente",
                DespachadoEn = "En espera",
                ResolucionEstimada = "48hs hábiles",
                PasoActual = 1
            }
        };

        _context.Incidencias.Add(incidencia);
        await _context.SaveChangesAsync();

        var esAdmin = EsAdminOInspector();
        return CreatedAtAction(
            nameof(GetByCodigo),
            new { codigo = incidencia.Codigo },
            MapToDto(incidencia, esAdmin));
    }

    // ────────────────────────────────────
    // PUT /api/incidencias/{codigo}
    // PATCH /api/incidencias/{codigo}/estado
    // ────────────────────────────────────
    [HttpPut("{codigo}")]
    [HttpPatch("{codigo}/estado")]
    public async Task<ActionResult<IncidenciaDto>> UpdateStatus(
        string codigo,
        [FromBody] ActualizarEstadoIncidenciaDto dto)
    {
        // 🔒 Validación server-side estricta: solo administradores o inspectores autenticados pueden modificar estado
        if (User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized(new { message = "Autenticación requerida para acceder a las funciones de gestión municipal." });
        }

        if (!EsAdminOInspector())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Acceso denegado: solo el personal con rol de Administrador o Inspector Municipal puede despachar órdenes de trabajo o modificar el estado de los reclamos."
            });
        }

        var incidencia = await _context.Incidencias
            .Include(i => i.Imagenes)
            .Include(i => i.LineaTiempo)
            .FirstOrDefaultAsync(i => i.Codigo == codigo);

        if (incidencia == null)
            return NotFound(new { message = $"No se encontró la incidencia con código '{codigo}'." });

        // Actualizar estado
        if (Enum.TryParse<EstadoIncidencia>(dto.Status, true, out var nuevoEstado))
            incidencia.Estado = nuevoEstado;

        if (!string.IsNullOrEmpty(dto.AssignedCuadrilla))
            incidencia.CuadrillaAsignada = dto.AssignedCuadrilla;

        if (!string.IsNullOrEmpty(dto.InspectorNotes))
            incidencia.NotasInspector = dto.InspectorNotes;

        // Actualizar línea de tiempo según el nuevo estado
        if (incidencia.LineaTiempo != null)
        {
            var stepMap = new Dictionary<EstadoIncidencia, int>
            {
                { EstadoIncidencia.Pendiente, 1 },
                { EstadoIncidencia.Proceso, 3 },
                { EstadoIncidencia.Resuelto, 4 },
                { EstadoIncidencia.Desestimado, 1 }
            };

            incidencia.LineaTiempo.PasoActual = stepMap.GetValueOrDefault(incidencia.Estado, 1);

            if (incidencia.Estado == EstadoIncidencia.Proceso)
                incidencia.LineaTiempo.DespachadoEn = "Despachado";
            if (incidencia.Estado == EstadoIncidencia.Resuelto)
                incidencia.LineaTiempo.ResolucionEstimada = "Resuelto";
        }

        await _context.SaveChangesAsync();
        return Ok(MapToDto(incidencia, esAdmin: true));
    }

    // ────────────────────────────────────
    // DELETE /api/incidencias/{codigo}
    // ────────────────────────────────────
    [HttpDelete("{codigo}")]
    public async Task<ActionResult> Delete(string codigo)
    {
        // 🔒 Validación server-side estricta: solo administradores o inspectores autenticados pueden eliminar reportes
        if (User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized(new { message = "Autenticación requerida para eliminar reclamos." });
        }

        if (!EsAdminOInspector())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Acceso denegado: solo el personal con rol de Administrador o Inspector Municipal puede eliminar reclamos del sistema."
            });
        }

        var incidencia = await _context.Incidencias
            .FirstOrDefaultAsync(i => i.Codigo == codigo);

        if (incidencia == null)
            return NotFound(new { message = $"No se encontró la incidencia con código '{codigo}'." });

        _context.Incidencias.Remove(incidencia);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ════════════════════════════════════
    // Helpers privados de validación y mapeo
    // ════════════════════════════════════

    private bool EsAdminOInspector()
    {
        if (User.Identity?.IsAuthenticated != true)
            return false;

        var rol = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value?.ToLower()
                  ?? User.FindFirst("role")?.Value?.ToLower();

        return rol == "admin" || rol == "inspector";
    }

    private static IncidenciaDto MapToDto(Incidencia i, bool esAdmin = false) => new()
    {
        Id = i.Codigo,
        Title = i.Titulo,
        Category = i.Categoria,
        CategorySlug = i.CategoriaSlug,
        Area = i.Area.ToString().ToLower(),
        Description = i.Descripcion,
        Location = i.Ubicacion,
        Locality = i.Localidad,
        Status = i.Estado.ToString().ToLower(),
        Urgency = i.Urgencia switch
        {
            NivelUrgencia.AltoRiesgo => "Alto/Riesgo",
            NivelUrgencia.Medio => "Medio",
            _ => "Bajo"
        },
        TimeAgo = i.TiempoTranscurrido,
        ReportedBy = i.ReportadoPor,
        ReporterEmail = i.EmailReportante,
        // 🔒 Privacidad: teléfono reportante protegido para ciudadanos
        ReporterPhone = esAdmin ? i.TelefonoReportante : null,
        Images = i.Imagenes.Select(img => img.Url).ToList(),
        AssignedCuadrilla = i.CuadrillaAsignada,
        OperatorInCharge = esAdmin ? i.OperadorACargo : null,
        InspectorNotes = esAdmin ? i.NotasInspector : null,
        Lat = i.Latitud,
        Lng = i.Longitud,
        Timeline = i.LineaTiempo != null ? new LineaTiempoDto
        {
            ReceivedAt = i.LineaTiempo.RecibidoEn,
            ReviewedAt = i.LineaTiempo.RevisadoEn,
            DispatchedAt = i.LineaTiempo.DespachadoEn,
            EstimatedResolution = i.LineaTiempo.ResolucionEstimada,
            CurrentStep = i.LineaTiempo.PasoActual
        } : null
    };
}
