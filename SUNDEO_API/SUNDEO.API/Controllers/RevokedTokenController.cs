using Microsoft.AspNetCore.Mvc;
using SUNDEO.API.Models;

namespace SUNDEO.API.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class RevokedTokensController : BaseController<RevokedToken>
        {
            public RevokedTokensController(SundeoDbContext context) : base(context)
            {
            }
        }
    }


