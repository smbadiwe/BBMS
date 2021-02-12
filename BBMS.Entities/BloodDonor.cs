using System;

namespace BBMS.Entities
{
    public class BloodDonor : Person
    {
        private DateTime _dateOfBirth;

        public DateTime DateOfBirth
        {
            get => _dateOfBirth;
            set { _dateOfBirth = value.Date; }
        }

        public RhFactor RhFactor { get; set; }
        public BloodGroup BloodGroup { get; set; }
        /// <summary>
        /// This will be a list of Q/As. It could be in XML or JSON 
        /// or ;-delimited (like a connectionstring) format.
        /// Business logic will determine.
        /// </summary>
        public string RelevantHistory { get; set; }
        public bool BasicHealthCheckDone { get; set; }
    }
}
