using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace NetAdmin.ApiSkin;

public class ApiSkinMiddleware
{
    private const    string                _EMBEDDED_FILE_NAMESPACE = "NetAdmin.ApiSkin";
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    private readonly ApiSkinOptions       _options;
    private readonly StaticFileMiddleware _staticFileMiddleware;

    [Obsolete("Obsolete")]
    public ApiSkinMiddleware(RequestDelegate next, IWebHostEnvironment hostingEnv, ILoggerFactory loggerFactory, ApiSkinOptions options)
    {
        _options = options ?? new ApiSkinOptions();

        _staticFileMiddleware = CreateStaticFileMiddleware(next, hostingEnv, loggerFactory, options);

        _jsonSerializerOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, IgnoreNullValues = true };
        _jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, false));
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try {
            var httpMethod = httpContext.Request.Method;
            var path       = httpContext.Request.Path.Value;

            switch (httpMethod) {
                // If the RoutePrefix is requested (with or without trailing slash), redirect to index URL
                case "GET" when Regex.IsMatch(path!, $"^/?{Regex.Escape(_options.RoutePrefix)}/?$"): {
                    // Use relative redirect to support proxy environments
                    var relativeRedirectPath = "/".EndsWith(path, StringComparison.OrdinalIgnoreCase)
                        ? "index.html"
                        : $"{path.Split('/').Last()}/index.html";

                    RespondWithRedirect(httpContext.Response, relativeRedirectPath);
                    return;
                }
                case "GET" when Regex.IsMatch(path, $"^/{Regex.Escape(_options.RoutePrefix)}/?index.html$"):
                    await RespondWithIndexHtml(httpContext.Response);
                    return;
                case "GET" when Regex.IsMatch(path, "/swagger-resources$"):
                    await RespondWithConfig(httpContext.Response);
                    return;
                default:
                    await _staticFileMiddleware.Invoke(httpContext);
                    break;
            }
        }
        catch (Exception ex) {
            Console.WriteLine(ex.StackTrace);
        }
    }

    private static StaticFileMiddleware CreateStaticFileMiddleware(RequestDelegate next, IWebHostEnvironment hostingEnv, ILoggerFactory loggerFactory
                                                                 , ApiSkinOptions  options)
    {
        var staticFileOptions = new StaticFileOptions {
                                                          RequestPath
                                                              = string.IsNullOrEmpty(options.RoutePrefix) ? string.Empty : $"/{options.RoutePrefix}"
                                                        , FileProvider = new EmbeddedFileProvider(
                                                              typeof(ApiSkinMiddleware).GetTypeInfo().Assembly, _EMBEDDED_FILE_NAMESPACE)
                                                      };

        return new StaticFileMiddleware(next, hostingEnv, Options.Create(staticFileOptions), loggerFactory);
    }

    private static void RespondWithRedirect(HttpResponse response, string location)
    {
        response.StatusCode       = 301;
        response.Headers.Location = location;
    }

    private Dictionary<string, string> GetIndexArguments()
    {
        return new Dictionary<string, string> {
                                                  { "%(DocumentTitle)", _options.DocumentTitle }, { "%(HeadContent)", _options.HeadContent }

                                                  //{ "%(OAuthConfigObject)", JsonSerializer.Serialize(_options.OAuthConfigObject, _jsonSerializerOptions) }
                                              };
    }

    private async Task RespondWithConfig(HttpResponse response)
    {
        await response.WriteAsync(JsonSerializer.Serialize(_options.ConfigObject.Urls, _jsonSerializerOptions));
    }

    private async Task RespondWithIndexHtml(HttpResponse response)
    {
        response.StatusCode  = 200;
        response.ContentType = "text/html;charset=utf-8";

        await using var stream = _options.IndexStream();

        // Inject arguments before writing to response
        var htmlBuilder = new StringBuilder(await new StreamReader(stream).ReadToEndAsync());

        foreach (var entry in GetIndexArguments()) {
            htmlBuilder.Replace(entry.Key, entry.Value);
        }

        await response.WriteAsync(htmlBuilder.ToString(), Encoding.UTF8);
    }
}