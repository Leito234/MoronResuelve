namespace MoronResuelve.Api.Models;

/// <summary>
/// Línea de tiempo de procesamiento de una incidencia.
/// Corresponde a la interfaz IncidentTimeline del frontend.
/// Relación 1:1 con Incidencia.
/// </summary>
public class LineaTiempo
{
    public int Id { get; set; }

    /// <summary>Hora/texto de recepción (ej: "10:14 hs").</summary>
    public string RecibidoEn { get; set; } = "";

    /// <summary>Hora/texto de revisión (ej: "11:05 hs").</summary>
    public string RevisadoEn { get; set; } = "";

    /// <summary>Hora/texto de despacho de cuadrilla (ej: "En viaje").</summary>
    public string DespachadoEn { get; set; } = "";

    /// <summary>Estimación de resolución (ej: "Estimado 17:00 hs").</summary>
    public string ResolucionEstimada { get; set; } = "";

    /// <summary>Paso actual del proceso: 1=Recibido, 2=Revisión, 3=Cuadrilla, 4=Resuelto.</summary>
    public int PasoActual { get; set; } = 1;

    // FK 1:1
    public int IncidenciaId { get; set; }
    public Incidencia Incidencia { get; set; } = null!;
}
