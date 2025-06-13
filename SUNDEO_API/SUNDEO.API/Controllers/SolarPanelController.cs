using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SolarPanelController : BaseController<SolarPanel>
{
    private readonly SundeoDbContext _context;

    public SolarPanelController(SundeoDbContext context) : base(context)
    {
        _context = context;
    }

    [HttpGet("plant/{plantId}")]
    public async Task<ActionResult<IEnumerable<SolarPanel>>> GetByPlant(int plantId)
    {
        var panels = await _context.SolarPanels
            .Where(p => p.PlantId == plantId)
            .ToListAsync();

        if (!panels.Any())
            return NotFound($"No hay paneles solares asociados a la planta {plantId}");

        return panels;
    }
}
