using System;

namespace BBMS.Entities
{
    public class BloodDonor : Person
    {
        public DateTime DateOfBirth { get; set; }
        public RhFactor RhFactor { get; set; }
        public BloodGroup BloodGroup { get; set; }
        /// <summary>
        /// This will be a list of Q/As. It could be in XML or JSON 
        /// or ;-delimited (like a connectionstring) format.
        /// Business logic will determine.
        /// </summary>
        public string RelevantHistory { get; set; }
    }
}
