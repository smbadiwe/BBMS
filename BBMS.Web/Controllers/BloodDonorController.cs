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

        [HttpGet("search")]
        public async Task<BloodDonor> GetDonor(DateTime dob, string lastName = null, string firstName = null)
        {
            var candidates = await _dbContext.Set<BloodDonor>()
                .Where(x => x.DateOfBirth == dob.Date)
                .ToListAsync();
            if (candidates == null || candidates.Count == 0) throw new BBMSException("No valid match", 404);
            if (candidates.Count == 1) return candidates[0];

            var query = candidates.AsEnumerable();
            if (!string.IsNullOrWhiteSpace(lastName))
            {
                query = query.Where(x => x.LastName.Contains(lastName, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrWhiteSpace(firstName))
            {
                query = query.Where(x => x.FirstName.Contains(firstName, StringComparison.OrdinalIgnoreCase));
            }

            var donor = query.FirstOrDefault();
            if (donor == default) throw new BBMSException("No valid match found", 404);
            return donor;
        }

        [HttpPost("signup")]
        public async Task SignupDonor(BloodDonor donor)
        {
            // TODO: Use a model class and validate client input before saving
            var existing = await _dbContext.Set<BloodDonor>()
                                            .FirstOrDefaultAsync(x => 
                                                x.FirstName == donor.FirstName
                                                && x.LastName == donor.LastName
                                                && x.DateOfBirth == donor.DateOfBirth);
            if (existing != null)
            {
                throw new BBMSException($"{donor.FirstName}, you've signed up before. Go ahead to schedule for blood donation");
            }

            _dbContext.Add(donor);
            await _dbContext.SaveChangesAsync();
        }

        [HttpPost("scheduleappointment")]
        public async Task ScheduleAppointment(BloodDonation donation)
        {
            // TODO: Use a model class and validate client input before saving
            donation.Status = BloodDonationStatus.Scheduled;
            await _dbContext.SaveChangesAsync();
        }
    }
}
