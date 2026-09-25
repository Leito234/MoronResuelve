namespace MoronResuelve.Api.Models.Enums;

/// <summary>
/// Nivel de urgencia percibido por el vecino reportante.
/// Valores: Bajo, Medio, Alto/Riesgo.
/// Nota: "Alto/Riesgo" contiene "/" que no es válido como nombre de enum,
/// por lo que se usa AltoRiesgo y se serializa como "Alto/Riesgo" vía atributo.
/// </summary>
public enum NivelUrgencia
{
    Bajo,
    Medio,
    AltoRiesgo   // Se serializa como "Alto/Riesgo" en el DTO
}
