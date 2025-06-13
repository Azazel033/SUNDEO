    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Text;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using SUNDEO.API.Models;
    using System;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Configuration;

    namespace SUNDEO.API.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class AuthController : ControllerBase
        {
            private readonly SundeoDbContext _context;
            private readonly IConfiguration _configuration;

            public AuthController(SundeoDbContext context, IConfiguration configuration)
            {
                _context = context;
                _configuration = configuration;
            }

        // Endpoint POST para el login de usuarios
        [HttpPost("login")]
        [AllowAnonymous] // Permite el acceso sin autenticación previa
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Busca al usuario en la base de datos por nombre de usuario
            var user = await _context.Set<User>()
                                      .FirstOrDefaultAsync(u => u.Username == request.Username);

            // Si el usuario no existe, retorna error 401 (No autorizado)
            if (user == null)
            {
                return Unauthorized("Usuario no encontrado");
            }

            // Verifica que la contraseña proporcionada coincida con el hash almacenado
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Contraseña incorrecta");
            }

            // Se definen los claims (información que se incluirá en el token JWT)
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, user.Role),             // Para manejo del backend
                new Claim("Username", user.Username),              // Nombre de usuario
                new Claim("Roll", user.Role),                      // Para manejo desde el frontend.
                new Claim("UserId", user.UserId.ToString())        // ID del usuario
            };

            // Se obtienen los valores de configuración para el JWT
            var jwtSettings = _configuration.GetSection("JwtSettings");

            // Se genera la clave simétrica a partir de la clave secreta configurada
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Se define la duración del token; si no se puede parsear, se usa un valor por defecto
            TimeSpan tokenLifetime;
            if (!TimeSpan.TryParse(jwtSettings["TokenLifetime"], out tokenLifetime))
            {
                tokenLifetime = TimeSpan.FromMinutes(3); // Valor por defecto si hay error en la configuración
            }

            // Se genera el token JWT con los claims, emisor, audiencia, expiración y credenciales
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.Add(tokenLifetime),
                signingCredentials: credentials
            );

            // Convierte el token a string para enviarlo al cliente
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.WriteToken(token);

            // Devuelve el token en la respuesta (status 200 OK)
            return Ok(new { Token = jwtToken });
        }


    }

    // DTO para el login (los datos que el cliente enviará)
    public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
