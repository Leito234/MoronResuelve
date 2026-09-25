namespace MoronResuelve.Api.DTOs;

// ──────────────────────────────────────────────────
// DTOs de Usuario (UserProfile)
// ──────────────────────────────────────────────────

/// <summary>
/// DTO de lectura del perfil de usuario.
/// Corresponde EXACTAMENTE a la interfaz UserProfile de TypeScript.
/// </summary>
public class UsuarioPerfilDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Locality { get; set; } = "";
    public int Level { get; set; }
    public int Points { get; set; }
    public bool IsVerified { get; set; }
    public string Role { get; set; } = "vecino";   // "vecino" | "inspector"
}

/// <summary>
/// DTO para cambiar el rol de un usuario (solo administradores / inspectores).
/// </summary>
public class CambiarRolUsuarioDto
{
    public string Role { get; set; } = "vecino";   // "vecino" | "inspector"
}

/// <summary>
/// DTO para el registro de un nuevo usuario (POST /api/auth/registro).
/// </summary>
public class RegistroUsuarioDto
{
    public string Nombre { get; set; } = "";
    public string Apellido { get; set; } = "";
    public string Email { get; set; } = "";
    public string Telefono { get; set; } = "";
    public string Localidad { get; set; } = "";
    public string Password { get; set; } = "";
}

/// <summary>
/// DTO para login (POST /api/auth/login).
/// </summary>
public class LoginDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

/// <summary>
/// Respuesta al login exitoso con JWT.
/// </summary>
public class LoginRespuestaDto
{
    public string Token { get; set; } = "";
    public UsuarioPerfilDto Usuario { get; set; } = new();
}
