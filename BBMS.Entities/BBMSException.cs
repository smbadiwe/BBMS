using System;

namespace BBMS
{
    public class BBMSException : Exception
    {
        public BBMSException()
        { }

        public BBMSException(string message)
            : base(message)
        { }

        public BBMSException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
}
