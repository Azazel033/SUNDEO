using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class EnergyProductionController : BaseController<EnergyProduction>
{
    private readonly SundeoDbContext _context;

    public EnergyProductionController(SundeoDbContext context) : base(context)
    {
        _context = context;
    }

    [HttpGet("plant/{plantId}")]
    public async Task<ActionResult<IEnumerable<EnergyProduction>>> GetByPlant(int plantId)
    {
        var productions = await _context.EnergyProductions
            .Where(e => e.PlantId == plantId)
            .ToListAsync();

        if (!productions.Any())
            return NotFound(new { message = $"No hay producción energética registrada para la planta {plantId}" });

        return productions;
    }

    [Authorize(Roles = "admin")]
    [HttpGet("daily-totals")]
    public async Task<ActionResult<IEnumerable<object>>> GetDailyTotals()
    {
        var result = await _context.EnergyProductions
            .GroupBy(ep => ep.Timestamp.Date)
            .Select(group => new
            {
                Date = group.Key,
                TotalEnergy = group.Sum(ep => ep.EnergyKwh)
            })
            .OrderBy(r => r.Date)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("user-daily/{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserDailyProduction(int userId)
    {
        var result = await _context.EnergyProductions
            .Where(ep => ep.SolarPlant.UserId == userId)
            .GroupBy(ep => ep.Timestamp.Date)
            .Select(group => new
            {
                Date = group.Key,
                TotalEnergy = group.Sum(ep => ep.EnergyKwh)
            })
            .OrderBy(r => r.Date)
            .ToListAsync();

        if (!result.Any())
            return NotFound(new { message = $"No se encontró producción energética para el usuario {userId}" });

        return Ok(result);
    }
}
