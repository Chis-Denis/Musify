using Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Musify.Options;


public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        httpContext.Response.ContentType = ConfigurationKeys.ApplicationJson;

        int statusCode = exception switch
        {
            BusinessException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        httpContext.Response.StatusCode = statusCode;

        var response = new
        {
            message = exception.Message,
            status = statusCode
        };

        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
