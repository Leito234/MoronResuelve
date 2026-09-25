namespace MoronResuelve.Api.Models;

/// <summary>
/// Localidades del partido de Morón.
/// Corresponde al array LOCALITIES del frontend.
/// </summary>
public class Localidad
{
    public int Id { get; set; }

    /// <summary>Slug identificador (ej: "moron-centro").</summary>
    public string SlugId { get; set; } = "";

    /// <summary>Nombre visible con UGC (ej: "Morón Centro (UGC 1)").</summary>
    public string Nombre { get; set; } = "";
}
