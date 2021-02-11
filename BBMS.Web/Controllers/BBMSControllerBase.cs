using Base.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BBMS.Entities;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace BBMS.Web.Controllers
{
    public sealed class BBMSJsonResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

    public class BBMSExceptionFilter : ActionFilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            HttpStatusCode status = HttpStatusCode.InternalServerError;
            string message = context.Exception.Message;

            var exceptionType = context.Exception.GetType();
            if (exceptionType == typeof(BBMSException))
            {
                status = HttpStatusCode.BadRequest;
            }
            else if (exceptionType == typeof(UnauthorizedAccessException))
            {
                message = "Unauthorized Access";
                status = HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(NotImplementedException))
            {
                message = "A server error occurred.";
                status = HttpStatusCode.NotImplemented;
            }
#if !DEBUG
            message += $"\nSTACK TRACE ({exceptionType.Name}):\n{context.Exception.StackTrace}";
#endif
            var errorData = new BBMSJsonResult
            {
                Message = message,
                Success = false,
            };
            context.ExceptionHandled = true;
            context.Result = status switch
            {
                HttpStatusCode.BadRequest => new BadRequestObjectResult(errorData),
                HttpStatusCode.Unauthorized => new UnauthorizedObjectResult(errorData),
                _ => new ObjectResult(errorData)
                {
                    StatusCode = (int)status,
                    DeclaredType = typeof(BBMSJsonResult)
                },
            };
        }
    }
}
