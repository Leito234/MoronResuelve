# BuffetApp.Api

Resumen
- API ASP.NET Core (.NET 10) para gestión de usuarios, productos, pedidos y facturas.
- Proyecto principal: `BuffetApp.Api.csproj`.
- DB: SQLite (archivo `buffet.db` por defecto, connection string en `appsettings.json`).

Requisitos
- .NET 10 SDK
- dotnet-ef (misma versión mayor que los paquetes EF del proyecto)
- Visual Studio 2022/2024/2026 o VS Code

Arrancar localmente
1. Restaurar y compilar:
   - dotnet restore BuffetApp.Api.csproj
   - dotnet build BuffetApp.Api.csproj
2. Migraciones / DB:
   - Crear migración (si hace falta):  
     dotnet ef migrations add NombreMigracion --project BuffetApp.Api.csproj
   - Aplicar migraciones:
     dotnet ef database update --project BuffetApp.Api.csproj
3. Ejecutar:
   - dotnet run --project BuffetApp.Api.csproj
   - La API expone Swagger UI (por defecto).

Convenciones de código y estructura
- Controllers en la carpeta `Controllers/`. Nombre de clase: `XyzController` y heredar de `ControllerBase`.
- Rutas: usar `[Route("api/[controller]")]` y atributos HTTP (`[HttpGet]`, `[HttpPost]`, etc.).
- Inyección de dependencias: recibir `BuffetContext` y `IConfiguration` en el constructor.
- DTOs en `DTOs/`, modelos en `Models/`, contexto EF en `Data/BuffetContext.cs`.
- Usar `JsonStringEnumConverter` para enums en JSON (ya configurado).
p