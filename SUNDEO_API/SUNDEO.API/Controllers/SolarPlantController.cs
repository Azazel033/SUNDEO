using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SUNDEO.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SolarPlantsController : BaseController<SolarPlant>
    {
        private readonly SundeoDbContext _context;

        public SolarPlantsController(SundeoDbContext context) : base(context)
        {
            _context = context;
        }

        // GET: api/solarplants/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<SolarPlant>>> GetPlantsByUser(int userId)
        {
            var plants = await _context.SolarPlants
                .Where(sp => sp.UserId == userId)
                .ToListAsync();

            if (!plants.Any())
            {
                return NotFound($"No se encontraron plantas para el usuario con ID {userId}.");
            }

            return plants;
        }
    }
}
