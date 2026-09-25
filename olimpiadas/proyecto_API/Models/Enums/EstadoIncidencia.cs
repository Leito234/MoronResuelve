namespace MoronResuelve.Api.Models.Enums;

/// <summary>
/// Estados posibles de un reporte de incidencia urbana.
/// Deben serializarse a: pendiente, proceso, resuelto, desestimado.
/// </summary>
public enum EstadoIncidencia
{
    Pendiente,
    Proceso,
    Resuelto,
    Desestimado
}
