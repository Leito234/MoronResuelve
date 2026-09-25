namespace MoronResuelve.Api.DTOs;

// ──────────────────────────────────────────────────
// DTOs de Incidencia (Incident)
// Los nombres de propiedades usan camelCase en JSON
// gracias a la configuración de System.Text.Json.
// ──────────────────────────────────────────────────

/// <summary>
/// DTO de lectura que devuelve el backend al frontend.
/// Corresponde EXACTAMENTE a la interfaz Incident de TypeScript.
/// </summary>
public class IncidenciaDto
{
    public string Id { get; set; } = "";           // "MOR-4821"
    public string Title { get; set; } = "";
    public string Category { get; set; } = "";
    public string CategorySlug { get; set; } = "";
    public string Area { get; set; } = "";          // "vialidad", "alumbrado", etc.
    public string Description { get; set; } = "";
    public string Location { get; set; } = "";
    public string Locality { get; set; } = "";
    public string Status { get; set; } = "";        // "pendiente", "proceso", etc.
    public string Urgency { get; set; } = "";       // "Bajo", "Medio", "Alto/Riesgo"
    public string TimeAgo { get; set; } = "";
    public string ReportedBy { get; set; } = "";
    public string ReporterEmail { get; set; } = "";
    public string? ReporterPhone { get; set; }
    public List<string> Images { get; set; } = new();
    public string? AssignedCuadrilla { get; set; }
    public string? OperatorInCharge { get; set; }
    public string? InspectorNotes { get; set; }
    public double? Lat { get; set; }
    public double? Lng { get; set; }
    public LineaTiempoDto? Timeline { get; set; }
}

/// <summary>
/// DTO de la línea de tiempo.
/// Corresponde a la interfaz IncidentTimeline de TypeScript.
/// </summary>
public class LineaTiempoDto
{
    public string ReceivedAt { get; set; } = "";
    public string ReviewedAt { get; set; } = "";
    public string DispatchedAt { get; set; } = "";
    public string EstimatedResolution { get; set; } = "";
    public int CurrentStep { get; set; } = 1;
}

/// <summary>
/// DTO para crear una nueva incidencia (POST).
/// El frontend envía estos datos al reportar.
/// </summary>
public class CrearIncidenciaDto
{
    public string Title { get; set; } = "";
    public string Category { get; set; } = "";
    public string CategorySlug { get; set; } = "";
    public string Area { get; set; } = "";
    public string Description { get; set; } = "";
    public string Location { get; set; } = "";
    public string Locality { get; set; } = "";
    public double? Lat { get; set; }
    public double? Lng { get; set; }
    public string Urgency { get; set; } = "Medio";
    public string ReportedBy { get; set; } = "";
    public string ReporterEmail { get; set; } = "";
    public string? ReporterPhone { get; set; }
    public List<string> Images { get; set; } = new();
    public string? AssignedCuadrilla { get; set; }
}

/// <summary>
/// DTO para actualizar el estado de una incidencia (PUT).
/// Usado por el inspector desde la Mesa de Control.
/// </summary>
public class ActualizarEstadoIncidenciaDto
{
    public string Status { get; set; } = "";        // "pendiente", "proceso", "resuelto", "desestimado"
    public string? AssignedCuadrilla { get; set; }
    public string? InspectorNotes { get; set; }
}
