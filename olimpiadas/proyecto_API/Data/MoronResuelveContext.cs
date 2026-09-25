using Microsoft.EntityFrameworkCore;
using MoronResuelve.Api.Models;

namespace MoronResuelve.Api.Data;

/// <summary>
/// Contexto de base de datos para Morón Resuelve.
/// Configura las tablas, relaciones y datos semilla (seed) que el frontend
/// necesita para funcionar desde la primera ejecución.
/// </summary>
public class MoronResuelveContext : DbContext
{
    public MoronResuelveContext(DbContextOptions<MoronResuelveContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Incidencia> Incidencias { get; set; }
    public DbSet<ImagenIncidencia> ImagenesIncidencias { get; set; }
    public DbSet<LineaTiempo> LineasTiempo { get; set; }
    public DbSet<CategoriaIncidencia> CategoriasIncidencias { get; set; }
    public DbSet<Localidad> Localidades { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Incidencia: código único ──
        modelBuilder.Entity<Incidencia>()
            .HasIndex(i => i.Codigo)
            .IsUnique();

        // ── Incidencia → Usuario (opcional, muchos a uno) ──
        modelBuilder.Entity<Incidencia>()
            .HasOne(i => i.Usuario)
            .WithMany(u => u.Incidencias)
            .HasForeignKey(i => i.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        // ── Incidencia → Imágenes (uno a muchos) ──
        modelBuilder.Entity<ImagenIncidencia>()
            .HasOne(img => img.Incidencia)
            .WithMany(i => i.Imagenes)
            .HasForeignKey(img => img.IncidenciaId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Incidencia → LineaTiempo (uno a uno) ──
        modelBuilder.Entity<LineaTiempo>()
            .HasOne(lt => lt.Incidencia)
            .WithOne(i => i.LineaTiempo)
            .HasForeignKey<LineaTiempo>(lt => lt.IncidenciaId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Usuario: email único ──
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // ── Localidad: slug único ──
        modelBuilder.Entity<Localidad>()
            .HasIndex(l => l.SlugId)
            .IsUnique();

        // ── CategoriaIncidencia: slug único ──
        modelBuilder.Entity<CategoriaIncidencia>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        // ══════════════════════════════════════
        // DATOS SEMILLA (SEED DATA)
        // Coinciden con mockData.ts del frontend
        // ══════════════════════════════════════

        // ── Localidades ──
        modelBuilder.Entity<Localidad>().HasData(
            new Localidad { Id = 1, SlugId = "moron-centro",    Nombre = "Morón Centro (UGC 1)" },
            new Localidad { Id = 2, SlugId = "haedo",           Nombre = "Haedo (UGC 2)" },
            new Localidad { Id = 3, SlugId = "el-palomar",      Nombre = "El Palomar (UGC 3)" },
            new Localidad { Id = 4, SlugId = "castelar-norte",  Nombre = "Castelar Norte (UGC 4)" },
            new Localidad { Id = 5, SlugId = "castelar-sur",    Nombre = "Castelar Sur (UGC 5)" },
            new Localidad { Id = 6, SlugId = "moron-sur",       Nombre = "Morón Sur (UGC 6)" },
            new Localidad { Id = 7, SlugId = "villa-sarmiento", Nombre = "Villa Sarmiento (UGC 7)" }
        );

        // ── Categorías (20 tipos) ──
        modelBuilder.Entity<CategoriaIncidencia>().HasData(
            new CategoriaIncidencia { Id =  1, CodigoCategoria = "01", Slug = "baches-calles",            Numero = "01", Titulo = "Baches en calles",       Descripcion = "Pavimento hundido, pozos y fisuras vehiculares.",      Icono = "traffic_jam",           Sla = "48-72h",          Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-primary" },
            new CategoriaIncidencia { Id =  2, CodigoCategoria = "02", Slug = "alumbrado-apagado",        Numero = "02", Titulo = "Alumbrado apagado",      Descripcion = "Farolas intermitentes, sin luz o tulipas rotas.",       Icono = "lightbulb",             Sla = "24-48h",          Area = "alumbrado",  ClaseBadgeColor = "bg-tertiary-fixed-dim/40 text-on-tertiary-fixed", ClaseContenedorIcono = "bg-tertiary-fixed text-tertiary-container" },
            new CategoriaIncidencia { Id =  3, CodigoCategoria = "03", Slug = "semaforos-fallas",          Numero = "03", Titulo = "Semáforos",               Descripcion = "Apagados, titilantes o desincronizados.",               Icono = "traffic",               Sla = "Urgente 6h",      Area = "vialidad",   ClaseBadgeColor = "bg-error-container text-on-error-container",      ClaseContenedorIcono = "bg-primary-fixed text-primary" },
            new CategoriaIncidencia { Id =  4, CodigoCategoria = "04", Slug = "acumulacion-basura",        Numero = "04", Titulo = "Acumulación basura",      Descripcion = "Microbasurales, residuos fuera de horario.",            Icono = "delete",                Sla = "24h",             Area = "higiene",    ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id =  5, CodigoCategoria = "05", Slug = "perdidas-agua",             Numero = "05", Titulo = "Pérdidas de agua",        Descripcion = "Caños rotos en vereda o calzada pública.",              Icono = "water_damage",          Sla = "24-48h",          Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-secondary-fixed text-primary" },
            new CategoriaIncidencia { Id =  6, CodigoCategoria = "06", Slug = "arboles-riesgo",            Numero = "06", Titulo = "Árboles caídos/riesgo",   Descripcion = "Ramas quebradas, troncos o raíces descalzadas.",        Icono = "nature_people",         Sla = "Prioridad",       Area = "espacios",   ClaseBadgeColor = "bg-error-container text-on-error-container",      ClaseContenedorIcono = "bg-tertiary-fixed text-tertiary" },
            new CategoriaIncidencia { Id =  7, CodigoCategoria = "07", Slug = "veredas-rotas",             Numero = "07", Titulo = "Calles o veredas",        Descripcion = "Baldosas levantadas, cordones destruidos.",             Icono = "broken_image",          Sla = "Programable",     Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id =  8, CodigoCategoria = "08", Slug = "senales-transito",          Numero = "08", Titulo = "Señales de tránsito",     Descripcion = "Carteles doblados, caídos o ilegibles.",                Icono = "signpost",              Sla = "48h",             Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-primary-fixed text-primary" },
            new CategoriaIncidencia { Id =  9, CodigoCategoria = "09", Slug = "paradas-colectivo",         Numero = "09", Titulo = "Paradas de colectivo",     Descripcion = "Refugios rotos, vidrios estallados, sin asiento.",      Icono = "departure_board",       Sla = "72h",             Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-secondary-fixed text-secondary" },
            new CategoriaIncidencia { Id = 10, CodigoCategoria = "10", Slug = "graffitis",                 Numero = "10", Titulo = "Pintadas / Graffitis",     Descripcion = "Frentes públicos o monumentos vandalizados.",           Icono = "format_paint",          Sla = "Cuadrilla",       Area = "higiene",    ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id = 11, CodigoCategoria = "11", Slug = "vehiculos-abandonados",     Numero = "11", Titulo = "Autos abandonados",       Descripcion = "Carrocerías quemadas, sin ruedas o en desuso.",         Icono = "car_crash",             Sla = "Inspección",      Area = "seguridad",  ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-primary" },
            new CategoriaIncidencia { Id = 12, CodigoCategoria = "12", Slug = "animales-abandonados",      Numero = "12", Titulo = "Fauna Urbana / Zoonosis",  Descripcion = "Mascotas heridas, extraviadas o en riesgo.",            Icono = "pets",                  Sla = "Zoonosis",        Area = "seguridad",  ClaseBadgeColor = "bg-tertiary-fixed-dim/50 text-on-tertiary-fixed", ClaseContenedorIcono = "bg-tertiary-fixed text-tertiary" },
            new CategoriaIncidencia { Id = 13, CodigoCategoria = "13", Slug = "sumideros-inundaciones",    Numero = "13", Titulo = "Sumideros e Inundación",   Descripcion = "Bocas de tormenta tapadas, agua estancada.",            Icono = "tsunami",               Sla = "Alerta 12h",      Area = "vialidad",   ClaseBadgeColor = "bg-error-container text-on-error-container",      ClaseContenedorIcono = "bg-secondary-fixed text-primary" },
            new CategoriaIncidencia { Id = 14, CodigoCategoria = "14", Slug = "ruidos-molestos",           Numero = "14", Titulo = "Ruidos molestos",          Descripcion = "Música a alto volumen reiterada, obras ilegales.",      Icono = "volume_up",             Sla = "Inspección",      Area = "seguridad",  ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id = 15, CodigoCategoria = "15", Slug = "estructuras-peligro",       Numero = "15", Titulo = "Estructuras en riesgo",    Descripcion = "Mampostería con desprendimiento, derrumbe.",            Icono = "domain",                Sla = "Obras",           Area = "seguridad",  ClaseBadgeColor = "bg-error-container text-on-error-container",      ClaseContenedorIcono = "bg-primary-fixed text-primary" },
            new CategoriaIncidencia { Id = 16, CodigoCategoria = "16", Slug = "bicisendas",                Numero = "16", Titulo = "Bicisendas",               Descripcion = "Separadores rotos, pintura borrada u ocupadas.",        Icono = "pedal_bike",            Sla = "48h",             Area = "vialidad",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-secondary-fixed text-secondary" },
            new CategoriaIncidencia { Id = 17, CodigoCategoria = "17", Slug = "espacios-verdes",           Numero = "17", Titulo = "Plazas y juegos",          Descripcion = "Pasto crecido, hamacas rotas o bancos dañados.",        Icono = "park",                  Sla = "3 a 5 días",      Area = "espacios",   ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id = 18, CodigoCategoria = "18", Slug = "contenedores-danados",      Numero = "18", Titulo = "Contenedores rotos",       Descripcion = "Quemados, sin tapa, ruedas rotas o volcados.",          Icono = "local_fire_department", Sla = "Reemplazo 24h",   Area = "higiene",    ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-primary-fixed text-primary" },
            new CategoriaIncidencia { Id = 19, CodigoCategoria = "19", Slug = "obstaculos-paso",           Numero = "19", Titulo = "Obstáculos en paso",       Descripcion = "Montículos de escombros, veredas bloqueadas.",          Icono = "crop_free",             Sla = "48h",             Area = "seguridad",  ClaseBadgeColor = "bg-secondary-container text-on-secondary-fixed",  ClaseContenedorIcono = "bg-surface-container text-secondary" },
            new CategoriaIncidencia { Id = 20, CodigoCategoria = "20", Slug = "cables-peligro-electrico",  Numero = "20", Titulo = "Cables o postes",          Descripcion = "Cables colgando, chispas o postes inclinados.",         Icono = "bolt",  IconoRelleno = true, Sla = "Urgente", Area = "alumbrado",  ClaseBadgeColor = "bg-error text-on-error",                          ClaseContenedorIcono = "bg-error-container text-on-error-container" }
        );

        // ── Usuario semilla (el vecino demo del frontend) ──
        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                Id = 1,
                Nombre = "Juan García",
                Email = "al_garcia@eest6.edu.ar",
                PasswordHash = "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
                Telefono = "11-2345-6789",
                Localidad = "Castelar Sur",
                Nivel = 3,
                Puntos = 850,
                EstaVerificado = true,
                Rol = Models.Enums.RolUsuario.Vecino,
                FechaRegistro = new DateTime(2025, 1, 15, 10, 0, 0, DateTimeKind.Utc)
            }
        );

        // ── Incidencias semilla (coinciden con INITIAL_INCIDENTS del frontend) ──
        modelBuilder.Entity<Incidencia>().HasData(
            new { Id = 1, Codigo = "MOR-4821", Titulo = "Baches profundos en calzada",     Categoria = "Bacheo y Asfalto",          CategoriaSlug = "baches-calles",     Area = Models.Enums.AreaIncidencia.Vialidad,   Descripcion = "Bache de gran profundidad obstruyendo carril derecho hacia estación Morón. Peligro para transporte público.", Ubicacion = "Av. Rivadavia 17400, Morón Centro",  Localidad = "Morón Centro",   Estado = Models.Enums.EstadoIncidencia.Pendiente,    Urgencia = Models.Enums.NivelUrgencia.AltoRiesgo, TiempoTranscurrido = "Hace 28 min",          ReportadoPor = "Juan García",       EmailReportante = "al_garcia@eest6.edu.ar",    TelefonoReportante = (string?)null, CuadrillaAsignada = "Obras Públicas / Bacheo Móvil #4",  OperadorACargo = (string?)null, NotasInspector = "Bache de gran profundidad que genera peligro para el paso del transporte público sobre carril derecho.", Latitud = (double?)-34.6531, Longitud = (double?)-58.6175, FechaCreacion = new DateTime(2025, 10, 14, 13, 14, 0, DateTimeKind.Utc), UsuarioId = 1 },
            new { Id = 2, Codigo = "MOR-4819", Titulo = "Alumbrado público apagado",       Categoria = "Alumbrado y Electromecánica", CategoriaSlug = "alumbrado-apagado", Area = Models.Enums.AreaIncidencia.Alumbrado,   Descripcion = "Sector juegos infantiles y sendero principal a oscuras desde la tormenta del martes. Requiere grúa de altura.",                                            Ubicacion = "Plaza San Martín, Castelar",         Localidad = "Castelar Sur",   Estado = Models.Enums.EstadoIncidencia.Pendiente,    Urgencia = Models.Enums.NivelUrgencia.Medio,       TiempoTranscurrido = "Hace 2 hs",           ReportadoPor = "Mariana Rossi",     EmailReportante = "m.rossi@gmail.com",         TelefonoReportante = (string?)null, CuadrillaAsignada = "Alumbrado y Electromecánica",       OperadorACargo = (string?)null, NotasInspector = "Sector juegos infantiles y sendero a oscuras. Requiere grúa con cesta hidráulica.",                       Latitud = (double?)-34.6575, Longitud = (double?)-58.6360, FechaCreacion = new DateTime(2025, 10, 14, 11, 30, 0, DateTimeKind.Utc), UsuarioId = (int?)null },
            new { Id = 3, Codigo = "MOR-4815", Titulo = "Microbasural / Ramas acumuladas", Categoria = "Higiene Urbana",             CategoriaSlug = "acumulacion-basura", Area = Models.Enums.AreaIncidencia.Higiene,    Descripcion = "Recolectando restos de poda y escombros ilegales. Camión recolector compactador asignado.",                                                                 Ubicacion = "Casullo y Brown, Morón Sur",         Localidad = "Morón Sur",      Estado = Models.Enums.EstadoIncidencia.Proceso,      Urgencia = Models.Enums.NivelUrgencia.Medio,       TiempoTranscurrido = "Hace 4 hs",           ReportadoPor = "Carlos Domínguez", EmailReportante = "carlos.d@moron.gob.ar",      TelefonoReportante = (string?)null, CuadrillaAsignada = "Higiene Urbana - Móvil 12",        OperadorACargo = "M. Benítez",  NotasInspector = "Ramas acumuladas bloqueando rampa de discapacitados y vereda.",                                            Latitud = (double?)-34.6605, Longitud = (double?)-58.6140, FechaCreacion = new DateTime(2025, 10, 14, 10, 45, 0, DateTimeKind.Utc), UsuarioId = (int?)null },
            new { Id = 4, Codigo = "MOR-4519", Titulo = "Luminaria LED quemada",           Categoria = "Alumbrado Público",          CategoriaSlug = "alumbrado-apagado",  Area = Models.Enums.AreaIncidencia.Alumbrado,  Descripcion = "Lámpara LED titilando y apagada sobre calle vecinal.",                                                                                                       Ubicacion = "Carlos Casares 840, Castelar",       Localidad = "Castelar Norte", Estado = Models.Enums.EstadoIncidencia.Resuelto,     Urgencia = Models.Enums.NivelUrgencia.Bajo,        TiempoTranscurrido = "Solucionado ayer",     ReportadoPor = "Juan García",       EmailReportante = "al_garcia@eest6.edu.ar",    TelefonoReportante = (string?)null, CuadrillaAsignada = "Alumbrado #2",                     OperadorACargo = (string?)null, NotasInspector = (string?)null,                                                                                              Latitud = (double?)-34.6470, Longitud = (double?)-58.6345, FechaCreacion = new DateTime(2025, 10, 13, 13, 0, 0, DateTimeKind.Utc),  UsuarioId = 1 },
            new { Id = 5, Codigo = "MOR-4301", Titulo = "Restos de poda acumulados",       Categoria = "Higiene Urbana",             CategoriaSlug = "arboles-riesgo",     Area = Models.Enums.AreaIncidencia.Espacios,   Descripcion = "Gran cantidad de ramas tras tormenta.",                                                                                                                      Ubicacion = "San Martín 310, Morón Centro",       Localidad = "Morón Centro",   Estado = Models.Enums.EstadoIncidencia.Resuelto,     Urgencia = Models.Enums.NivelUrgencia.Bajo,        TiempoTranscurrido = "Solucionado 12 Oct",   ReportadoPor = "Juan García",       EmailReportante = "al_garcia@eest6.edu.ar",    TelefonoReportante = (string?)null, CuadrillaAsignada = "Espacios Verdes",                  OperadorACargo = (string?)null, NotasInspector = (string?)null,                                                                                              Latitud = (double?)-34.6515, Longitud = (double?)-58.6210, FechaCreacion = new DateTime(2025, 10, 12, 12, 0, 0, DateTimeKind.Utc),  UsuarioId = 1 }
        );

        // ── Imágenes de las incidencias semilla ──
        modelBuilder.Entity<ImagenIncidencia>().HasData(
            new ImagenIncidencia { Id = 1, IncidenciaId = 1, Url = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwkOFk8IIK50La8Np0y9fRuSNIp2aDqwaBzNXgFBmT48hSSznS8OcrsqQO9BVjDKyj8KNdhnyOdxHiIG79nERkBnAeTI0PpxNOHjLZpHUA2DpV_lT3kNhCd-hFi6xXYwQZuPVH_GafKjEWbDeeA0IWvWqU4QdnOJe986wOi0WyN3zjImtUSMdkHKKmF5hDtiChLSQ5K4pI7-w2RWPIheovz-MokNbuidVw7HMYuMu-eSlK_AVHoofC" },
            new ImagenIncidencia { Id = 2, IncidenciaId = 2, Url = "https://lh3.googleusercontent.com/aida-public/AB6AXuDJNqRtdOqE16Kt_RJ_wvKQD6E0e8UEXEF_irHJdSUxMBZIPgBQT-rEu80EblXc6CmmyaVMb3cbmkxNfcybIj1WiR7dA8rD-5WD0LaiLlNG4ImnyxdlxYxiOlytKbXbMurzBXTRhuxOGm2IXBoqi5pZNr7OCXAPv0pE1-CPZoyO9Hmze3HVJ8gIKb0HaG6i6bjRPXHnumEsa0SIBoHMbH9M-jJlIGziiRvJraUeWkIxlKLVrj4i5lYD" },
            new ImagenIncidencia { Id = 3, IncidenciaId = 3, Url = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcV463bufaR4g22dd3KNdwMzFbSXzo2ecpxNdcxBwKmdnyGJeuc-iKAMG4lBLPPyp1VXwBHsNsphRQ2tdlOgVco6CuY8QxhUp_wUi5glwvsAGVpmYel9-5Iyt6cZWERNZtkKLHFIsF90lb2vwBYFiotExRpa51MIKhfFH12RFtUTBk9Gr_uNvhfkGpAHavj2ikhn2KwUbJqhajFVWMRIehuYL3EJk7eoW_4lNJpHuacqtNC0IoSiU" }
        );

        // ── Líneas de tiempo de las incidencias semilla ──
        modelBuilder.Entity<LineaTiempo>().HasData(
            new LineaTiempo { Id = 1, IncidenciaId = 1, RecibidoEn = "10:14 hs",           RevisadoEn = "11:05 hs",         DespachadoEn = "En viaje",          ResolucionEstimada = "Estimado 17:00 hs",        PasoActual = 3 },
            new LineaTiempo { Id = 2, IncidenciaId = 2, RecibidoEn = "08:30 hs",           RevisadoEn = "09:15 hs",         DespachadoEn = "Pendiente",         ResolucionEstimada = "Estimado mañana 12:00 hs", PasoActual = 2 },
            new LineaTiempo { Id = 3, IncidenciaId = 3, RecibidoEn = "07:45 hs",           RevisadoEn = "08:10 hs",         DespachadoEn = "09:00 hs",          ResolucionEstimada = "Estimado 13:00 hs",        PasoActual = 3 },
            new LineaTiempo { Id = 4, IncidenciaId = 4, RecibidoEn = "Ayer 10:00 hs",      RevisadoEn = "Ayer 11:00 hs",    DespachadoEn = "Ayer 14:00 hs",     ResolucionEstimada = "Resuelto ayer 18:30 hs",   PasoActual = 4 },
            new LineaTiempo { Id = 5, IncidenciaId = 5, RecibidoEn = "12 Oct 09:00 hs",    RevisadoEn = "12 Oct 10:30 hs",  DespachadoEn = "12 Oct 13:00 hs",   ResolucionEstimada = "Resuelto 12 Oct 16:45 hs", PasoActual = 4 }
        );

        base.OnModelCreating(modelBuilder);
    }
}
