namespace MoronResuelve.Api.DTOs;

// ──────────────────────────────────────────────────
// DTOs de Localidad (LOCALITIES)
// ──────────────────────────────────────────────────

/// <summary>
/// DTO de lectura de una localidad.
/// Corresponde EXACTAMENTE al objeto { id, name } del frontend.
/// </summary>
public class LocalidadDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
}
