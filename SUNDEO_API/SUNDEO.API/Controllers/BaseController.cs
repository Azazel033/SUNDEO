using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Models; // Asegúrate de tener esto para SundeoDbContext
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SUNDEO.API.Controllers
{
    [Authorize]
    public class BaseController<TEntity> : ControllerBase where TEntity : class
    {
        protected readonly SundeoDbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public BaseController(SundeoDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }

        // GET: api/{entity}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TEntity>>> GetAll()
        {
            return await _dbSet.ToListAsync();
        }

        // GET: api/{entity}/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TEntity>> GetById(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        // POST: api/{entity}
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<TEntity>> Create(TEntity entity)
        {
            var keyProperty = entity.GetType().GetProperties()
                                     .FirstOrDefault(p => Attribute.IsDefined(p, typeof(KeyAttribute)));

            if (keyProperty == null)
            {
                return BadRequest("La entidad no tiene una propiedad de clave primaria.");
            }

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            var id = keyProperty.GetValue(entity);
            return CreatedAtAction(nameof(GetById), new { id = id }, entity);
        }

        // PUT: api/{entity}/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TEntity entity)
        {
            // Buscar una propiedad que termine en "Id" (como InverterId, UserId, etc.)
            var idProperty = entity.GetType()
                .GetProperties()
                .FirstOrDefault(p =>
                    p.Name.EndsWith("Id", StringComparison.OrdinalIgnoreCase) &&
                    p.PropertyType == typeof(int));

            if (idProperty == null)
            {
                return BadRequest("No se pudo identificar la propiedad ID de la entidad.");
            }

            var entityId = (int)idProperty.GetValue(entity);

            if (entityId != id)
            {
                return BadRequest("El ID proporcionado no coincide con el de la entidad.");
            }

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("No se pudo actualizar el registro. Puede que no exista.");
            }

            return NoContent();
        }


        // DELETE: api/{entity}/{id}
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbSet.FindAsync(id);

            if (entity == null)
            {
                return NotFound();
            }

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
