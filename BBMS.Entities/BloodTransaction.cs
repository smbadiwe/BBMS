using Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace BBMS.Entities
{
    public interface IAmBlood
    {
        RhFactor RhFactor { get; set; }
        BloodGroup BloodGroup { get; set; }
        int Pints { get; set; }
    }

    public class BloodTransaction : Entity, IAmBlood
    {
        /// <summary>
        /// The <see cref="TransactionType"/> will determine which table to search for this reference.
        /// </summary>
        public string Reference { get; set; }
        public RhFactor RhFactor { get; set; }
        public BloodGroup BloodGroup { get; set; }
        public int Pints { get; set; }
        public BloodTransactionType TransactionType { get; set; }
        public Admin PostedBy { get; set; }
    }

    public enum BloodTransactionType
    {
        // Incomings
        DonationFromIndividual = 1,
        DonationFromCorporation = 2,
        DonationGiven = 3,
        Purchase = 4,

        // Outgoings
        Sale = 11,
        DestroyedDueToContamination =12,
        DestroyedDueToExpiry = 13,
    }
}
