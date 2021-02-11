using Base.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BBMS.Entities;

namespace BBMS.Web.Controllers
{
    [ApiController]
    [Route("api/bloodtransaction")]
    public class BloodTransactionController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly BaseDbContext _dbContext;
        public BloodTransactionController(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        //public async Task<ActionResult> Get(DateTime? dateFrom = null, DateTime? dateTo = null,
        //    string reference = null, int page = 1, int pageSize = 10)
        public async Task<PagedResult<BloodTransaction>> Get(DateTime? dateFrom = null, DateTime? dateTo = null,
            string reference = null, int page = 1, int pageSize = 10)
        {
            var list = _dbContext.Set<BloodTransaction>()
                .SearchDateRange(dateFrom, dateTo);
            //TODO: Search
            if (!string.IsNullOrWhiteSpace(reference))
            {
                list.Where(x => x.Reference.Contains(reference, StringComparison.InvariantCultureIgnoreCase));
            }
            var result = await list.OrderByDescending(x => x.DateCreatedUtc).GetPagedAsync(page, pageSize);
            //return Ok(result);
            return result;
        }
    }
}
