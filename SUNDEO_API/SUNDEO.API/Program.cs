using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SUNDEO.API.Models;
using Microsoft.OpenApi.Models;

namespace SUNDEO.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Se obtiene la sección de configuración relacionada con JWT desde appsettings.json
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");

            // Configura la autenticación JWT como método por defecto
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Define cómo se debe validar el token recibido
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"], // Emisor válido
                    ValidAudience = jwtSettings["Audience"], // Audiencia válida
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])) // Clave secreta
                };
            });

            // Configura CORS para permitir solicitudes desde cualquier origen, método y encabezado
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder => builder.AllowAnyOrigin()
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });

            // Registra el contexto de base de datos usando SQL Server con la cadena de conexión configurada
            builder.Services.AddDbContext<SundeoDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Agrega servicios necesarios para controladores API
            builder.Services.AddControllers();

            // Configura Swagger (documentación de la API) y define seguridad con JWT para probar endpoints protegidos
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SUNDEO API", Version = "v1" });

                // Configura el esquema de seguridad para permitir uso de JWT en Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Ingresa tu token JWT en este formato: Bearer {tu_token}"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            // Construye la aplicación con toda la configuración previa
            var app = builder.Build();


            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<SundeoDbContext>();

                // Aplica migraciones pendientes (crea base de datos si no existe)
                dbContext.Database.Migrate();

                // Opcional: Seeding inicial solo si no hay usuarios
                if (!dbContext.Users.Any())
                {
                    SeedDatabase(dbContext);
                }
            }

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

        private static void SeedDatabase(SundeoDbContext dbContext)
        {
            if (dbContext.Users.Any()) return;

            var random = new Random();

            // Usuario fijo "Daniel"
            var adminUser = new User
            {
                Username = "Daniel",
                PasswordHash = "$2b$12$Ozkzz.kv4eQsMY8WF1K5EeeK5eYCHfcY3yJ.Ey.cP8D30VxD9s3ee",
                Email = "correo@gmail.com",
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };
            dbContext.Users.Add(adminUser);
            dbContext.SaveChanges();

            var users = new List<User> {};

            // Agregar 9 usuarios adicionales
            for (int i = 1; i <= 9; i++)
            {
                var user = new User
                {
                    Username = $"user{i}",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Email = $"user{i}@mail.com",
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                };
                dbContext.Users.Add(user);
                dbContext.SaveChanges();
                users.Add(user);
            }

            int plantCounter = 1;
            foreach (var user in users)
            {
                int plantCount = random.Next(1, 4); // 1 a 3 plantas
                for (int i = 0; i < plantCount; i++)
                {
                    var plant = new SolarPlant
                    {
                        UserId = user.UserId,
                        PlantName = $"Planta_{plantCounter}",
                        CapacityKw = random.Next(50, 201),
                        InstallDate = DateTime.UtcNow.AddDays(-random.Next(100, 1000)),
                        Latitude = 10 + (decimal)random.NextDouble(),
                        Longitude = -84 + (decimal)random.NextDouble()
                    };
                    dbContext.SolarPlants.Add(plant);
                    dbContext.SaveChanges();

                    // Paneles
                    for (int j = 0; j < random.Next(1, 4); j++)
                    {
                        dbContext.SolarPanels.Add(new SolarPanel
                        {
                            PlantId = plant.PlantId,
                            Model = $"Panel_Model_{j + 1}",
                            PowerRatingW = random.Next(250, 400),
                            Orientation = "south",
                            TiltAngle = 25 + (decimal)random.NextDouble() * 10,
                            InstallationDate = plant.InstallDate.AddMonths(random.Next(1, 6))
                        });
                    }

                    // Inversores
                    for (int j = 0; j < random.Next(1, 3); j++)
                    {
                        dbContext.Inverters.Add(new Inverter
                        {
                            PlantId = plant.PlantId,
                            Model = $"Inverter_Model_{j + 1}",
                            MaxPowerKw = random.Next(10, 60),
                            Efficiency = 0.95m + (decimal)(random.NextDouble() * 0.03),
                            SerialNumber = $"INV-{Guid.NewGuid()}",
                            InstallationDate = plant.InstallDate.AddMonths(random.Next(1, 6))
                        });
                    }

                    // Baterías
                    for (int j = 0; j < random.Next(1, 3); j++)
                    {
                        dbContext.Batteries.Add(new Battery
                        {
                            PlantId = plant.PlantId,
                            Model = $"Battery_Model_{j + 1}",
                            CapacityKwh = random.Next(20, 100),
                            Efficiency = 0.85m + (decimal)(random.NextDouble() * 0.1),
                            InstallationDate = plant.InstallDate.AddMonths(random.Next(1, 6))
                        });
                    }

                    // Producción de Energía con múltiples registros y fechas variadas
                    for (int j = 0; j < 10; j++)
                    {
                        dbContext.EnergyProductions.Add(new EnergyProduction
                        {
                            PlantId = plant.PlantId,
                            Timestamp = DateTime.UtcNow.AddDays(-j),
                            EnergyKwh = random.Next(80, 150),
                            DcVoltage = random.Next(300, 400),
                            AcVoltage = 220,
                            Temperature = 20 + (decimal)(random.NextDouble() * 10)
                        });
                    }

                    dbContext.SaveChanges();
                    plantCounter++;
                }
            }
        }

    }
}
