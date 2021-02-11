using System;

namespace Base
{
    public abstract class Entity
    {
        public int Id { get; set; }
        public DateTime DateCreatedUtc { get; set; }
    }
}
