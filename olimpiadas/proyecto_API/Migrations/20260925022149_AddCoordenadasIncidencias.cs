using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoronResuelve.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordenadasIncidencias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitud",
                table: "Incidencias",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitud",
                table: "Incidencias",
                type: "double precision",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Incidencias",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Latitud", "Longitud" },
                values: new object[] { -34.653100000000002, -58.6175 });

            migrationBuilder.UpdateData(
                table: "Incidencias",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Latitud", "Longitud" },
                values: new object[] { -34.657499999999999, -58.636000000000003 });

            migrationBuilder.UpdateData(
                table: "Incidencias",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Latitud", "Longitud" },
                values: new object[] { -34.660499999999999, -58.613999999999997 });

            migrationBuilder.UpdateData(
                table: "Incidencias",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Latitud", "Longitud" },
                values: new object[] { -34.646999999999998, -58.634500000000003 });

            migrationBuilder.UpdateData(
                table: "Incidencias",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Latitud", "Longitud" },
                values: new object[] { -34.651499999999999, -58.621000000000002 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitud",
                table: "Incidencias");

            migrationBuilder.DropColumn(
                name: "Longitud",
                table: "Incidencias");
        }
    }
}
