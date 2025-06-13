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
    public class InvertersController : BaseController<Inverter>
    {
        private readonly SundeoDbContext _context;

        public InvertersController(SundeoDbContext context) : base(context)
        {
            _context = context;
        }

        // GET: api/inverters/plant/5
        [HttpGet("plant/{plantId}")]
        public async Task<ActionResult<IEnumerable<Inverter>>> GetByPlant(int plantId)
        {
            var inverters = await _context.Inverters
                .Where(i => i.PlantId == plantId)
                .ToListAsync();

            if (!inverters.Any())
                return NotFound($"No hay inversores asociados a la planta {plantId}");

            return inverters;
        }
    }
}
