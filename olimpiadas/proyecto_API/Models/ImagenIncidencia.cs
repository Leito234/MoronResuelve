namespace MoronResuelve.Api.Models;

/// <summary>
/// Almacena la URL de cada imagen adjunta a una incidencia.
/// El frontend maneja un array de strings (URLs).
/// </summary>
public class ImagenIncidencia
{
    public int Id { get; set; }

    /// <summary>URL de la imagen.</summary>
    public string Url { get; set; } = "";

    // FK
    public int IncidenciaId { get; set; }
    public Incidencia Incidencia { get; set; } = null!;
}
