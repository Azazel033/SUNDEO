using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Models;
using System;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace SUNDEO.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController<User>
    {
        public UsersController(SundeoDbContext context) : base(context) { }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Username == username);
            return user == null ? NotFound() : user;
        }

        [Authorize(Roles = "admin")]
        [HttpPut("editAdmin/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDtoAdmin updatedUser)
        {
            var existingUser = await _context.Set<User>().FindAsync(id);
            if (existingUser == null)
                return NotFound();

            existingUser.Username = updatedUser.Username;
            existingUser.Email = updatedUser.Email;

            if (!string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
            {
                // Hashear la nueva contraseña si se proporciona
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updatedUser)
        {
            var existingUser = await _context.Set<User>().FindAsync(id);
            if (existingUser == null)
                return NotFound();

            // Validar contraseña actual
            if (string.IsNullOrWhiteSpace(updatedUser.CurrentPassword) ||
                !BCrypt.Net.BCrypt.Verify(updatedUser.CurrentPassword, existingUser.PasswordHash))
            {
                return BadRequest(new { message = "La contraseña actual es incorrecta." });
            }

            // Actualizar datos
            existingUser.Username = updatedUser.Username;
            existingUser.Email = updatedUser.Email;

            // Si se proporcionó una nueva contraseña válida
            if (!string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
            {
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }




        [Authorize(Roles = "admin")]
        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterUser(CreateUserDto request)
        {
            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Email = request.Email,
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserByUsername), new { username = user.Username }, user);
        }
    }

    public class CreateUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string Email { get; set; }
    }

    public class UpdateUserDtoAdmin
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }

        public string PasswordHash { get; set; }
    }

    public class UpdateUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string PasswordHash { get; set; }
    }
}
