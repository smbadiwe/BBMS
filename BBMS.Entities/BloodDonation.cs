using Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace BBMS.Entities
{
    // See Blood donation eligibility requirements:
    //  https://www.redcrossblood.org/donate-blood/how-to-donate/eligibility-requirements.html

    public class BloodDonation : Entity
    {
        public BloodDonor Donor { get; set; }
        /// <summary>
        /// True if not a first-time donor
        /// </summary>
        public bool RecurringDonor { get; set; }
        public DateTime AppointmentDateUtc { get; set; }
        public DateTime? EarliestNextAppointmentDateUtc { get; set; }
        public BloodDonationStatus Status { get; set; }
        /// <summary>
        /// How many pints was donated
        /// </summary>
        public int Pints { get; set; }
        /// <summary>
        /// True if not donating full blood
        /// </summary>
        public bool PlateletsOnly { get; set; }
    }

    public enum BloodDonationStatus
    {
        Scheduled = 0,
        ReScheduled = 1,
        Cancelled = 2,
        // Anything else?
        Donated = 5,
        // Anything else?
    }
}
