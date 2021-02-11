using System;
using System.Linq;
using System.Collections.Generic;

namespace BBMS.Entities
{
    public class Admin : Person
    {
        public string Password { get; set; }
        /// <summary>
        /// DO NOT set this directly. Use .AddRoles() instead.
        /// </summary>
        public string Roles { get; set; }
    }

    public enum AdminRole
    {
        SignUpIndividualBloodDonors = 1,
        ProcessIndividualBloodDonations = 2,
        RootAccess = 99,
    }
}