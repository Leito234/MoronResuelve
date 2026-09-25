namespace MoronResuelve.Api.Models;

/// <summary>
/// Representa una categoría del catálogo de incidencias (20 tipos).
/// Corresponde a la interfaz IncidentCategory del frontend.
/// </summary>
public class CategoriaIncidencia
{
    public int Id { get; set; }

    /// <summary>Código visible de la categoría (ej: "01").</summary>
    public string CodigoCategoria { get; set; } = "";

    /// <summary>Slug para URL (ej: "baches-calles").</summary>
    public string Slug { get; set; } = "";

    /// <summary>Número visible (ej: "01").</summary>
    public string Numero { get; set; } = "";

    /// <summary>Título de la categoría (ej: "Baches en calles").</summary>
    public string Titulo { get; set; } = "";

    /// <summary>Descripción breve de la categoría.</summary>
    public string Descripcion { get; set; } = "";

    /// <summary>Nombre del ícono Material Symbols (ej: "traffic_jam").</summary>
    public string Icono { get; set; } = "";

    /// <summary>Si el ícono debe mostrarse con fill.</summary>
    public bool IconoRelleno { get; set; } = false;

    /// <summary>Tiempo de SLA estimado (ej: "48-72h").</summary>
    public string Sla { get; set; } = "";

    /// <summary>Área operativa a la que pertenece.</summary>
    public string Area { get; set; } = "";

    /// <summary>Clase CSS para el badge de color.</summary>
    public string ClaseBadgeColor { get; set; } = "";

    /// <summary>Clase CSS para el contenedor del ícono.</summary>
    public string ClaseContenedorIcono { get; set; } = "";
}
