using System;

namespace BBMS
{
    public class BBMSException : Exception
    {
        public readonly int StatusCode = 400;
        public BBMSException(int statusCode = 400)
        { StatusCode = statusCode; }

        public BBMSException(string message, int statusCode = 400)
            : base(message)
        { StatusCode = statusCode; }

        public BBMSException(string message, Exception innerException, int statusCode = 400)
            : base(message, innerException)
        { StatusCode = statusCode; }
    }
}
