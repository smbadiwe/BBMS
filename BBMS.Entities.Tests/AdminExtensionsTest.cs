using System;
using System.Collections.Generic;
using Xunit;

namespace BBMS.Entities.Tests
{
    public class AdminExtensionsTest
    {
        [Fact]
        public void Can_parse_roles_if_given_as_int()
        {
            var admin = new Admin { Roles = "1,99" };
            var expected = new HashSet<AdminRole>(
                new[] {
                    AdminRole.SignUpIndividualBloodDonors,
                    AdminRole.RootAccess
                });
            Assert.All(admin.RolesToList(), r => expected.Contains(r));
        }

        [Fact]
        public void Can_parse_roles_if_given_as_string()
        {
            var admin = new Admin { Roles = "RootAccess,SignUpIndividualBloodDonors" };
            var expected = new HashSet<AdminRole>(
                new[] {
                    AdminRole.SignUpIndividualBloodDonors,
                    AdminRole.RootAccess
                });
            Assert.All(admin.RolesToList(), r => expected.Contains(r));
        }

        [Fact]
        public void Can_parse_roles_if_given_as_string_caseinsensitive()
        {
            var admin = new Admin { Roles = "RootAccess,SignUpIndividualBloodDonors".ToLower() };
            var expected = new HashSet<AdminRole>(
                new[] {
                    AdminRole.SignUpIndividualBloodDonors,
                    AdminRole.RootAccess
                });
            Assert.All(admin.RolesToList(), r => expected.Contains(r));
        }

        [Fact]
        public void Can_add_roles()
        {
            var admin = new Admin { Roles = "1" };
            var expected = new HashSet<AdminRole>(
                new[] {
                    AdminRole.SignUpIndividualBloodDonors,
                    AdminRole.RootAccess
                });
            admin.AddRoles(new[] { AdminRole.RootAccess });
            Assert.All(admin.RolesToList(), r => expected.Contains(r));
        }

        [Fact]
        public void Can_remove_roles()
        {
            var admin = new Admin { Roles = "1,99" };
            admin.RemoveRoles(new[] { AdminRole.SignUpIndividualBloodDonors });
            Assert.Equal("99", admin.Roles);
        }

        [Fact]
        public void Can_remove_all_roles_at_once()
        {
            var admin = new Admin { Roles = "1,99" };
            admin.RemoveAllRoles();
            Assert.True(string.IsNullOrWhiteSpace(admin.Roles));
        }

    }
}
