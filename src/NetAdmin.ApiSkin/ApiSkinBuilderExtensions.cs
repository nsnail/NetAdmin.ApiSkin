using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace NetAdmin.ApiSkin;

public static class ApiSkinBuilderExtensions
{
    public static IApplicationBuilder UseApiSkin(this IApplicationBuilder app, ApiSkinOptions options)
    {
        return app.UseMiddleware<ApiSkinMiddleware>(options);
    }

    public static IApplicationBuilder UseApiSkin(this IApplicationBuilder app, Action<ApiSkinOptions> setupAction = null)
    {
        ApiSkinOptions options;
        using (var scope = app.ApplicationServices.CreateScope()) {
            options = scope.ServiceProvider.GetRequiredService<IOptionsSnapshot<ApiSkinOptions>>().Value;
            setupAction?.Invoke(options);
        }

        switch (options.ConfigObject.Urls) {
            case null: {
                var hostingEnv = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();
                options.ConfigObject.Urls = [new UrlDescriptor { Name = $"{hostingEnv.ApplicationName} v1", Url = "v1/swagger.json" }];
                break;
            }
        }

        return app.UseApiSkin(options);
    }
}