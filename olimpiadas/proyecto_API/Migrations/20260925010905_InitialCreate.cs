using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MoronResuelve.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CategoriasIncidencias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CodigoCategoria = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Numero = table.Column<string>(type: "text", nullable: false),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Icono = table.Column<string>(type: "text", nullable: false),
                    IconoRelleno = table.Column<bool>(type: "boolean", nullable: false),
                    Sla = table.Column<string>(type: "text", nullable: false),
                    Area = table.Column<string>(type: "text", nullable: false),
                    ClaseBadgeColor = table.Column<string>(type: "text", nullable: false),
                    ClaseContenedorIcono = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriasIncidencias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Localidades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SlugId = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localidades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Telefono = table.Column<string>(type: "text", nullable: false),
                    Localidad = table.Column<string>(type: "text", nullable: false),
                    Nivel = table.Column<int>(type: "integer", nullable: false),
                    Puntos = table.Column<int>(type: "integer", nullable: false),
                    EstaVerificado = table.Column<bool>(type: "boolean", nullable: false),
                    Rol = table.Column<int>(type: "integer", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Incidencias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "text", nullable: false),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Categoria = table.Column<string>(type: "text", nullable: false),
                    CategoriaSlug = table.Column<string>(type: "text", nullable: false),
                    Area = table.Column<int>(type: "integer", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Ubicacion = table.Column<string>(type: "text", nullable: false),
                    Localidad = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    Urgencia = table.Column<int>(type: "integer", nullable: false),
                    TiempoTranscurrido = table.Column<string>(type: "text", nullable: false),
                    ReportadoPor = table.Column<string>(type: "text", nullable: false),
                    EmailReportante = table.Column<string>(type: "text", nullable: false),
                    TelefonoReportante = table.Column<string>(type: "text", nullable: true),
                    CuadrillaAsignada = table.Column<string>(type: "text", nullable: true),
                    OperadorACargo = table.Column<string>(type: "text", nullable: true),
                    NotasInspector = table.Column<string>(type: "text", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidencias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Incidencias_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ImagenesIncidencias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Url = table.Column<string>(type: "text", nullable: false),
                    IncidenciaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagenesIncidencias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImagenesIncidencias_Incidencias_IncidenciaId",
                        column: x => x.IncidenciaId,
                        principalTable: "Incidencias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LineasTiempo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RecibidoEn = table.Column<string>(type: "text", nullable: false),
                    RevisadoEn = table.Column<string>(type: "text", nullable: false),
                    DespachadoEn = table.Column<string>(type: "text", nullable: false),
                    ResolucionEstimada = table.Column<string>(type: "text", nullable: false),
                    PasoActual = table.Column<int>(type: "integer", nullable: false),
                    IncidenciaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineasTiempo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LineasTiempo_Incidencias_IncidenciaId",
                        column: x => x.IncidenciaId,
                        principalTable: "Incidencias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "CategoriasIncidencias",
                columns: new[] { "Id", "Area", "ClaseBadgeColor", "ClaseContenedorIcono", "CodigoCategoria", "Descripcion", "Icono", "IconoRelleno", "Numero", "Sla", "Slug", "Titulo" },
                values: new object[,]
                {
                    { 1, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-primary", "01", "Pavimento hundido, pozos y fisuras vehiculares.", "traffic_jam", false, "01", "48-72h", "baches-calles", "Baches en calles" },
                    { 2, "alumbrado", "bg-tertiary-fixed-dim/40 text-on-tertiary-fixed", "bg-tertiary-fixed text-tertiary-container", "02", "Farolas intermitentes, sin luz o tulipas rotas.", "lightbulb", false, "02", "24-48h", "alumbrado-apagado", "Alumbrado apagado" },
                    { 3, "vialidad", "bg-error-container text-on-error-container", "bg-primary-fixed text-primary", "03", "Apagados, titilantes o desincronizados.", "traffic", false, "03", "Urgente 6h", "semaforos-fallas", "Semáforos" },
                    { 4, "higiene", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "04", "Microbasurales, residuos fuera de horario.", "delete", false, "04", "24h", "acumulacion-basura", "Acumulación basura" },
                    { 5, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-secondary-fixed text-primary", "05", "Caños rotos en vereda o calzada pública.", "water_damage", false, "05", "24-48h", "perdidas-agua", "Pérdidas de agua" },
                    { 6, "espacios", "bg-error-container text-on-error-container", "bg-tertiary-fixed text-tertiary", "06", "Ramas quebradas, troncos o raíces descalzadas.", "nature_people", false, "06", "Prioridad", "arboles-riesgo", "Árboles caídos/riesgo" },
                    { 7, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "07", "Baldosas levantadas, cordones destruidos.", "broken_image", false, "07", "Programable", "veredas-rotas", "Calles o veredas" },
                    { 8, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-primary-fixed text-primary", "08", "Carteles doblados, caídos o ilegibles.", "signpost", false, "08", "48h", "senales-transito", "Señales de tránsito" },
                    { 9, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-secondary-fixed text-secondary", "09", "Refugios rotos, vidrios estallados, sin asiento.", "departure_board", false, "09", "72h", "paradas-colectivo", "Paradas de colectivo" },
                    { 10, "higiene", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "10", "Frentes públicos o monumentos vandalizados.", "format_paint", false, "10", "Cuadrilla", "graffitis", "Pintadas / Graffitis" },
                    { 11, "seguridad", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-primary", "11", "Carrocerías quemadas, sin ruedas o en desuso.", "car_crash", false, "11", "Inspección", "vehiculos-abandonados", "Autos abandonados" },
                    { 12, "seguridad", "bg-tertiary-fixed-dim/50 text-on-tertiary-fixed", "bg-tertiary-fixed text-tertiary", "12", "Mascotas heridas, extraviadas o en riesgo.", "pets", false, "12", "Zoonosis", "animales-abandonados", "Fauna Urbana / Zoonosis" },
                    { 13, "vialidad", "bg-error-container text-on-error-container", "bg-secondary-fixed text-primary", "13", "Bocas de tormenta tapadas, agua estancada.", "tsunami", false, "13", "Alerta 12h", "sumideros-inundaciones", "Sumideros e Inundación" },
                    { 14, "seguridad", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "14", "Música a alto volumen reiterada, obras ilegales.", "volume_up", false, "14", "Inspección", "ruidos-molestos", "Ruidos molestos" },
                    { 15, "seguridad", "bg-error-container text-on-error-container", "bg-primary-fixed text-primary", "15", "Mampostería con desprendimiento, derrumbe.", "domain", false, "15", "Obras", "estructuras-peligro", "Estructuras en riesgo" },
                    { 16, "vialidad", "bg-secondary-container text-on-secondary-fixed", "bg-secondary-fixed text-secondary", "16", "Separadores rotos, pintura borrada u ocupadas.", "pedal_bike", false, "16", "48h", "bicisendas", "Bicisendas" },
                    { 17, "espacios", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "17", "Pasto crecido, hamacas rotas o bancos dañados.", "park", false, "17", "3 a 5 días", "espacios-verdes", "Plazas y juegos" },
                    { 18, "higiene", "bg-secondary-container text-on-secondary-fixed", "bg-primary-fixed text-primary", "18", "Quemados, sin tapa, ruedas rotas o volcados.", "local_fire_department", false, "18", "Reemplazo 24h", "contenedores-danados", "Contenedores rotos" },
                    { 19, "seguridad", "bg-secondary-container text-on-secondary-fixed", "bg-surface-container text-secondary", "19", "Montículos de escombros, veredas bloqueadas.", "crop_free", false, "19", "48h", "obstaculos-paso", "Obstáculos en paso" },
                    { 20, "alumbrado", "bg-error text-on-error", "bg-error-container text-on-error-container", "20", "Cables colgando, chispas o postes inclinados.", "bolt", true, "20", "Urgente", "cables-peligro-electrico", "Cables o postes" }
                });

            migrationBuilder.InsertData(
                table: "Incidencias",
                columns: new[] { "Id", "Area", "Categoria", "CategoriaSlug", "Codigo", "CuadrillaAsignada", "Descripcion", "EmailReportante", "Estado", "FechaCreacion", "Localidad", "NotasInspector", "OperadorACargo", "ReportadoPor", "TelefonoReportante", "TiempoTranscurrido", "Titulo", "Ubicacion", "Urgencia", "UsuarioId" },
                values: new object[,]
                {
                    { 2, 1, "Alumbrado y Electromecánica", "alumbrado-apagado", "MOR-4819", "Alumbrado y Electromecánica", "Sector juegos infantiles y sendero principal a oscuras desde la tormenta del martes. Requiere grúa de altura.", "m.rossi@gmail.com", 0, new DateTime(2025, 10, 14, 11, 30, 0, 0, DateTimeKind.Utc), "Castelar Sur", "Sector juegos infantiles y sendero a oscuras. Requiere grúa con cesta hidráulica.", null, "Mariana Rossi", null, "Hace 2 hs", "Alumbrado público apagado", "Plaza San Martín, Castelar", 1, null },
                    { 3, 2, "Higiene Urbana", "acumulacion-basura", "MOR-4815", "Higiene Urbana - Móvil 12", "Recolectando restos de poda y escombros ilegales. Camión recolector compactador asignado.", "carlos.d@moron.gob.ar", 1, new DateTime(2025, 10, 14, 10, 45, 0, 0, DateTimeKind.Utc), "Morón Sur", "Ramas acumuladas bloqueando rampa de discapacitados y vereda.", "M. Benítez", "Carlos Domínguez", null, "Hace 4 hs", "Microbasural / Ramas acumuladas", "Casullo y Brown, Morón Sur", 1, null }
                });

            migrationBuilder.InsertData(
                table: "Localidades",
                columns: new[] { "Id", "Nombre", "SlugId" },
                values: new object[,]
                {
                    { 1, "Morón Centro (UGC 1)", "moron-centro" },
                    { 2, "Haedo (UGC 2)", "haedo" },
                    { 3, "El Palomar (UGC 3)", "el-palomar" },
                    { 4, "Castelar Norte (UGC 4)", "castelar-norte" },
                    { 5, "Castelar Sur (UGC 5)", "castelar-sur" },
                    { 6, "Morón Sur (UGC 6)", "moron-sur" },
                    { 7, "Villa Sarmiento (UGC 7)", "villa-sarmiento" }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Activo", "Email", "EstaVerificado", "FechaRegistro", "Localidad", "Nivel", "Nombre", "PasswordHash", "Puntos", "Rol", "Telefono" },
                values: new object[] { 1, true, "al_garcia@eest6.edu.ar", true, new DateTime(2025, 1, 15, 10, 0, 0, 0, DateTimeKind.Utc), "Castelar Sur", 3, "Juan García", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", 850, 0, "11-2345-6789" });

            migrationBuilder.InsertData(
                table: "ImagenesIncidencias",
                columns: new[] { "Id", "IncidenciaId", "Url" },
                values: new object[,]
                {
                    { 2, 2, "https://lh3.googleusercontent.com/aida-public/AB6AXuDJNqRtdOqE16Kt_RJ_wvKQD6E0e8UEXEF_irHJdSUxMBZIPgBQT-rEu80EblXc6CmmyaVMb3cbmkxNfcybIj1WiR7dA8rD-5WD0LaiLlNG4ImnyxdlxYxiOlytKbXbMurzBXTRhuxOGm2IXBoqi5pZNr7OCXAPv0pE1-CPZoyO9Hmze3HVJ8gIKb0HaG6i6bjRPXHnumEsa0SIBoHMbH9M-jJlIGziiRvJraUeWkIxlKLVrj4i5lYD" },
                    { 3, 3, "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcV463bufaR4g22dd3KNdwMzFbSXzo2ecpxNdcxBwKmdnyGJeuc-iKAMG4lBLPPyp1VXwBHsNsphRQ2tdlOgVco6CuY8QxhUp_wUi5glwvsAGVpmYel9-5Iyt6cZWERNZtkKLHFIsF90lb2vwBYFiotExRpa51MIKhfFH12RFtUTBk9Gr_uNvhfkGpAHavj2ikhn2KwUbJqhajFVWMRIehuYL3EJk7eoW_4lNJpHuacqtNC0IoSiU" }
                });

            migrationBuilder.InsertData(
                table: "Incidencias",
                columns: new[] { "Id", "Area", "Categoria", "CategoriaSlug", "Codigo", "CuadrillaAsignada", "Descripcion", "EmailReportante", "Estado", "FechaCreacion", "Localidad", "NotasInspector", "OperadorACargo", "ReportadoPor", "TelefonoReportante", "TiempoTranscurrido", "Titulo", "Ubicacion", "Urgencia", "UsuarioId" },
                values: new object[,]
                {
                    { 1, 0, "Bacheo y Asfalto", "baches-calles", "MOR-4821", "Obras Públicas / Bacheo Móvil #4", "Bache de gran profundidad obstruyendo carril derecho hacia estación Morón. Peligro para transporte público.", "al_garcia@eest6.edu.ar", 0, new DateTime(2025, 10, 14, 13, 14, 0, 0, DateTimeKind.Utc), "Morón Centro", "Bache de gran profundidad que genera peligro para el paso del transporte público sobre carril derecho.", null, "Juan García", null, "Hace 28 min", "Baches profundos en calzada", "Av. Rivadavia 17400, Morón Centro", 2, 1 },
                    { 4, 1, "Alumbrado Público", "alumbrado-apagado", "MOR-4519", "Alumbrado #2", "Lámpara LED titilando y apagada sobre calle vecinal.", "al_garcia@eest6.edu.ar", 2, new DateTime(2025, 10, 13, 13, 0, 0, 0, DateTimeKind.Utc), "Castelar Norte", null, null, "Juan García", null, "Solucionado ayer", "Luminaria LED quemada", "Carlos Casares 840, Castelar", 0, 1 },
                    { 5, 3, "Higiene Urbana", "arboles-riesgo", "MOR-4301", "Espacios Verdes", "Gran cantidad de ramas tras tormenta.", "al_garcia@eest6.edu.ar", 2, new DateTime(2025, 10, 12, 12, 0, 0, 0, DateTimeKind.Utc), "Morón Centro", null, null, "Juan García", null, "Solucionado 12 Oct", "Restos de poda acumulados", "San Martín 310, Morón Centro", 0, 1 }
                });

            migrationBuilder.InsertData(
                table: "LineasTiempo",
                columns: new[] { "Id", "DespachadoEn", "IncidenciaId", "PasoActual", "RecibidoEn", "ResolucionEstimada", "RevisadoEn" },
                values: new object[,]
                {
                    { 2, "Pendiente", 2, 2, "08:30 hs", "Estimado mañana 12:00 hs", "09:15 hs" },
                    { 3, "09:00 hs", 3, 3, "07:45 hs", "Estimado 13:00 hs", "08:10 hs" }
                });

            migrationBuilder.InsertData(
                table: "ImagenesIncidencias",
                columns: new[] { "Id", "IncidenciaId", "Url" },
                values: new object[] { 1, 1, "https://lh3.googleusercontent.com/aida-public/AB6AXuBwkOFk8IIK50La8Np0y9fRuSNIp2aDqwaBzNXgFBmT48hSSznS8OcrsqQO9BVjDKyj8KNdhnyOdxHiIG79nERkBnAeTI0PpxNOHjLZpHUA2DpV_lT3kNhCd-hFi6xXYwQZuPVH_GafKjEWbDeeA0IWvWqU4QdnOJe986wOi0WyN3zjImtUSMdkHKKmF5hDtiChLSQ5K4pI7-w2RWPIheovz-MokNbuidVw7HMYuMu-eSlK_AVHoofC" });

            migrationBuilder.InsertData(
                table: "LineasTiempo",
                columns: new[] { "Id", "DespachadoEn", "IncidenciaId", "PasoActual", "RecibidoEn", "ResolucionEstimada", "RevisadoEn" },
                values: new object[,]
                {
                    { 1, "En viaje", 1, 3, "10:14 hs", "Estimado 17:00 hs", "11:05 hs" },
                    { 4, "Ayer 14:00 hs", 4, 4, "Ayer 10:00 hs", "Resuelto ayer 18:30 hs", "Ayer 11:00 hs" },
                    { 5, "12 Oct 13:00 hs", 5, 4, "12 Oct 09:00 hs", "Resuelto 12 Oct 16:45 hs", "12 Oct 10:30 hs" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoriasIncidencias_Slug",
                table: "CategoriasIncidencias",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImagenesIncidencias_IncidenciaId",
                table: "ImagenesIncidencias",
                column: "IncidenciaId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidencias_Codigo",
                table: "Incidencias",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Incidencias_UsuarioId",
                table: "Incidencias",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasTiempo_IncidenciaId",
                table: "LineasTiempo",
                column: "IncidenciaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Localidades_SlugId",
                table: "Localidades",
                column: "SlugId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoriasIncidencias");

            migrationBuilder.DropTable(
                name: "ImagenesIncidencias");

            migrationBuilder.DropTable(
                name: "LineasTiempo");

            migrationBuilder.DropTable(
                name: "Localidades");

            migrationBuilder.DropTable(
                name: "Incidencias");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
