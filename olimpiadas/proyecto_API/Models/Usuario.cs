using MoronResuelve.Api.Models.Enums;

namespace MoronResuelve.Api.Models;

/// <summary>
/// Representa un usuario (vecino o inspector) de la plataforma Morón Resuelve.
/// Corresponde a la interfaz UserProfile del frontend.
/// </summary>
public class Usuario
{
    public int Id { get; set; }

    /// <summary>Nombre completo del usuario (ej: "Juan García").</summary>
    public string Nombre { get; set; } = "";

    /// <summary>Correo electrónico, también sirve como login.</summary>
    public string Email { get; set; } = "";

    /// <summary>Hash de la contraseña (BCrypt).</summary>
    public string PasswordHash { get; set; } = "";

    /// <summary>Teléfono de contacto / WhatsApp (string, no int).</summary>
    public string Telefono { get; set; } = "";

    /// <summary>Localidad del usuario dentro del partido de Morón.</summary>
    public string Localidad { get; set; } = "";

    /// <summary>Nivel cívico (gamificación vecinal).</summary>
    public int Nivel { get; set; } = 1;

    /// <summary>Puntos cívicos acumulados.</summary>
    public int Puntos { get; set; } = 0;

    /// <summary>Si el usuario verificó su identidad.</summary>
    public bool EstaVerificado { get; set; } = false;

    /// <summary>Rol del usuario: Vecino o Inspector.</summary>
    public RolUsuario Rol { get; set; } = RolUsuario.Vecino;

    public bool Activo { get; set; } = true;

    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

    // Navegación: un usuario puede tener muchos reportes
    public List<Incidencia> Incidencias { get; set; } = new();
}