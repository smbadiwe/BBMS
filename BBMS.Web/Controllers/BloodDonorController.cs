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
    [Route("api/blooddonor")]
    public class BloodDonorController : ControllerBase
    {
        private readonly BaseDbContext _dbContext;
        public BloodDonorController(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("list")]
        public async Task<PagedResult<BloodDonor>> Get(DateTime? dateFrom = null, DateTime? dateTo = null,
            int page = 1, int pageSize = 10)
        {
            var list = _dbContext.Set<BloodDonor>()
                .SearchDateRange(dateFrom, dateTo);
            
            return await list.OrderByDescending(x => x.DateCreatedUtc).GetPagedAsync(page, pageSize);
        }

        [HttpPost("signup")]
        public async Task SignupDonor(BloodDonor donor)
        {
            // TODO: Use a model class and validate client input before saving
            //_dbContext.Add(donor);
            await _dbContext.SaveChangesAsync();
            throw new BBMSException("Si ebe-a puo biko!");
        }
    }
}
