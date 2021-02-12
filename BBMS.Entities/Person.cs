using Base;
using System;

namespace BBMS.Entities
{
    public abstract class Person : Entity
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public Gender Gender { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
    }

    public enum Gender
    {
        Female = 1,
        Male
    }

}
