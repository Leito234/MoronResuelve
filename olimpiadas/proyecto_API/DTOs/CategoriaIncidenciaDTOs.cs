namespace MoronResuelve.Api.DTOs;

// ──────────────────────────────────────────────────
// DTOs de CategoríaIncidencia (IncidentCategory)
// ──────────────────────────────────────────────────

/// <summary>
/// DTO de lectura de una categoría del catálogo.
/// Corresponde EXACTAMENTE a la interfaz IncidentCategory de TypeScript.
/// </summary>
public class CategoriaIncidenciaDto
{
    public string Id { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Number { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";
    public bool? IconFilled { get; set; }
    public string Sla { get; set; } = "";
    public string Area { get; set; } = "";
    public string ColorBadgeClass { get; set; } = "";
    public string IconContainerClass { get; set; } = "";
}
