using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BatteryController : BaseController<Battery>
{
    private readonly SundeoDbContext _context;

    public BatteryController(SundeoDbContext context) : base(context)
    {
        _context = context;
    }

    [HttpGet("plant/{plantId}")]
    public async Task<ActionResult<IEnumerable<Battery>>> GetByPlant(int plantId)
    {
        var batteries = await _context.Batteries
            .Where(b => b.PlantId == plantId)
            .ToListAsync();

        if (!batteries.Any())
            return NotFound($"No hay baterías asociadas a la planta {plantId}");

        return batteries;
    }
}
