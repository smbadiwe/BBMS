using System;
using System.Collections.Generic;

namespace Base.EF
{
    public abstract class PagedResultBase
    {
        /// <summary>
        /// Current page (1-based indexing)
        /// </summary>
        public int CurrentPage { get; set; } = 1;
        /// <summary>
        /// Total number of pages
        /// </summary>
        public int PageCount { get; set; } = 1;
        /// <summary>
        /// (Max) number of records per page
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// Total number of relevant records in the DB
        /// </summary>
        public int RowCount { get; set; }

        //public int FirstRowOnPage => (CurrentPage - 1) * PageSize + 1;

        //public int LastRowOnPage => Math.Min(CurrentPage * PageSize, RowCount);
    }

    public class PagedResult<T> : PagedResultBase where T : class
    {
        public IList<T> Results { get; set; } = new List<T>();
    }
}