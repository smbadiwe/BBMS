using System;
using System.Collections.Generic;
using System.Linq;

namespace BBMS.Entities
{
    public static class AdminExtensions
    {
        public static HashSet<AdminRole> RolesToList(this Admin admin)
        {
            if (string.IsNullOrWhiteSpace(admin.Roles)) return new HashSet<AdminRole>();

            return new HashSet<AdminRole>(
                admin.Roles.Split(",", StringSplitOptions.RemoveEmptyEntries)
                .Select(r => Enum.Parse<AdminRole>(r, true)));
        }

        public static void AddRoles(this Admin admin, IEnumerable<AdminRole> roles)
        {
            admin.Roles ??= "";

            var existingRoles = admin.RolesToList();

            foreach (var role in roles)
            {
                existingRoles.Add(role);
            }
            admin.Roles = string.Join(",", existingRoles.Select(r => (int)r));

        }

        public static void RemoveAllRoles(this Admin admin)
        {
            admin.Roles = null;
        }

        public static void RemoveRoles(this Admin admin, IEnumerable<AdminRole> roles)
        {
            admin.Roles ??= "";

            var existingRoles = admin.RolesToList();
            foreach(var role in roles)
            {
                existingRoles.Remove(role);
            }
            admin.Roles = string.Join(",", existingRoles.Select(r => (int)r));

        }
    }

}
