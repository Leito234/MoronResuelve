using MoronResuelve.Api.Models.Enums;

namespace MoronResuelve.Api.Models;

/// <summary>
/// Representa un reporte/incidencia urbana creado por un vecino.
/// Corresponde a la interfaz Incident del frontend.
/// </summary>
public class Incidencia
{
    public int Id { get; set; }

    /// <summary>Código único visible (ej: "MOR-4821").</summary>
    public string Codigo { get; set; } = "";

    /// <summary>Título descriptivo del incidente.</summary>
    public string Titulo { get; set; } = "";

    /// <summary>Nombre de la categoría (ej: "Bacheo y Asfalto").</summary>
    public string Categoria { get; set; } = "";

    /// <summary>Slug de la categoría (ej: "baches-calles").</summary>
    public string CategoriaSlug { get; set; } = "";

    /// <summary>Área operativa a la que pertenece.</summary>
    public AreaIncidencia Area { get; set; }

    /// <summary>Descripción detallada del problema.</summary>
    public string Descripcion { get; set; } = "";

    /// <summary>Dirección / ubicación del incidente.</summary>
    public string Ubicacion { get; set; } = "";

    /// <summary>Localidad dentro de Morón.</summary>
    public string Localidad { get; set; } = "";

    /// <summary>Coordenada de latitud geográfica (opcional).</summary>
    public double? Latitud { get; set; }

    /// <summary>Coordenada de longitud geográfica (opcional).</summary>
    public double? Longitud { get; set; }

    /// <summary>Estado actual del reporte.</summary>
    public EstadoIncidencia Estado { get; set; } = EstadoIncidencia.Pendiente;

    /// <summary>Nivel de urgencia percibido.</summary>
    public NivelUrgencia Urgencia { get; set; } = NivelUrgencia.Medio;

    /// <summary>Texto relativo de hace cuánto se creó (ej: "Hace 28 min").</summary>
    public string TiempoTranscurrido { get; set; } = "Recién";

    /// <summary>Nombre del vecino que reportó.</summary>
    public string ReportadoPor { get; set; } = "";

    /// <summary>Email del reportante.</summary>
    public string EmailReportante { get; set; } = "";

    /// <summary>Teléfono del reportante (opcional).</summary>
    public string? TelefonoReportante { get; set; }

    /// <summary>Cuadrilla asignada (opcional).</summary>
    public string? CuadrillaAsignada { get; set; }

    /// <summary>Operador a cargo de la cuadrilla (opcional).</summary>
    public string? OperadorACargo { get; set; }

    /// <summary>Notas del inspector (opcional).</summary>
    public string? NotasInspector { get; set; }

    /// <summary>Fecha/hora de creación real.</summary>
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    // FK al usuario que creó el reporte
    public int? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    // Navegación: imágenes adjuntas
    public List<ImagenIncidencia> Imagenes { get; set; } = new();

    // Navegación: línea de tiempo
    public LineaTiempo? LineaTiempo { get; set; }
}
