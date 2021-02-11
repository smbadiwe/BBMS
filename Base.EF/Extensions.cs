using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Base.EF
{
    public static class Extensions
    {
        public static IQueryable<T> SearchDateRange<T>(this IQueryable<T> list, DateTime? dateFrom, DateTime? dateTo) where T : Entity
        {
            if (dateFrom.HasValue && dateTo.HasValue && dateFrom.Value > dateTo.Value)
            {
                var temp = dateFrom;
                dateFrom = dateTo;
                dateTo = temp;
            }
            if (dateFrom.HasValue && dateFrom.Value > DateTime.MinValue)
            {
                list.Where(x => x.DateCreatedUtc >= dateFrom.Value.Date);
            }
            if (dateTo.HasValue && dateTo.Value > DateTime.MinValue)
            {
                list.Where(x => x.DateCreatedUtc < dateTo.Value.Date.AddDays(1).AddSeconds(-1));
            }

            return list;
        }
        public static async Task<PagedResult<T>> GetPagedAsync<T>(this IQueryable<T> query,
                                            int page, int pageSize) where T : class
        {
            // Don't let code fail due to silly values. Just restore to sensible defaults.
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            var result = new PagedResult<T>
            {
                CurrentPage = page,
                PageSize = pageSize,
                RowCount = await query.CountAsync()
            };

            var pageCount = (double)result.RowCount / pageSize;
            result.PageCount = (int)Math.Ceiling(pageCount);

            result.Results = await query.Skip((page - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            return result;
        }

        public static async Task<PagedResult<U>> GetPagedAsync<T, U>(this IQueryable<T> query,
                                            int page, int pageSize, Expression<Func<T, U>> transform) where U : class
        {
            var result = new PagedResult<U>
            {
                CurrentPage = page,
                PageSize = pageSize,
                RowCount = await query.CountAsync()
            };

            var pageCount = (double)result.RowCount / pageSize;
            result.PageCount = (int)Math.Ceiling(pageCount);

            result.Results = await query.Skip((page - 1) * pageSize)
                .Take(pageSize).Select(transform)
                .ToListAsync();

            return result;
        }
    }
}
