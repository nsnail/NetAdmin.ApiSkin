using System.Globalization;
using System.Text;

namespace NetAdmin.ApiSkin;

public static class ApiSkinOptionsExtensions
{
    /// <summary>
    ///     The default expansion depth for the model on the model-example section
    /// </summary>
    /// <param name="options"></param>
    /// <param name="depth"></param>
    public static void DefaultModelExpandDepth(this ApiSkinOptions options, int depth)
    {
        options.ConfigObject.DefaultModelExpandDepth = depth;
    }

    /// <summary>
    ///     Controls how the model is shown when the API is first rendered.
    ///     (The user can always switch the rendering for a given model by clicking the 'Model' and 'Example Value' links.)
    /// </summary>
    /// <param name="options"></param>
    /// <param name="modelRendering"></param>
    public static void DefaultModelRendering(this ApiSkinOptions options, ModelRendering modelRendering)
    {
        options.ConfigObject.DefaultModelRendering = modelRendering;
    }

    /// <summary>
    ///     The default expansion depth for models (set to -1 completely hide the models)
    /// </summary>
    /// <param name="options"></param>
    /// <param name="depth"></param>
    public static void DefaultModelsExpandDepth(this ApiSkinOptions options, int depth)
    {
        options.ConfigObject.DefaultModelsExpandDepth = depth;
    }

    /// <summary>
    ///     Controls the display of operationId in operations list
    /// </summary>
    /// <param name="options"></param>
    public static void DisplayOperationId(this ApiSkinOptions options)
    {
        options.ConfigObject.DisplayOperationId = true;
    }

    /// <summary>
    ///     Controls the display of the request duration (in milliseconds) for Try-It-Out requests
    /// </summary>
    /// <param name="options"></param>
    public static void DisplayRequestDuration(this ApiSkinOptions options)
    {
        options.ConfigObject.DisplayRequestDuration = true;
    }

    /// <summary>
    ///     Controls the default expansion setting for the operations and tags.
    ///     It can be 'List' (expands only the tags), 'Full' (expands the tags and operations) or 'None' (expands nothing)
    /// </summary>
    /// <param name="options"></param>
    /// <param name="docExpansion"></param>
    public static void DocExpansion(this ApiSkinOptions options, DocExpansion docExpansion)
    {
        options.ConfigObject.DocExpansion = docExpansion;
    }

    /// <summary>
    ///     Enables deep linking for tags and operations
    /// </summary>
    /// <param name="options"></param>
    public static void EnableDeepLinking(this ApiSkinOptions options)
    {
        options.ConfigObject.DeepLinking = true;
    }

    /// <summary>
    ///     Enables filtering. The top bar will show an edit box that you can use to filter the tagged operations that are shown.
    ///     If an expression is provided it will be used and applied initially.
    ///     Filtering is case sensitive matching the filter expression anywhere inside the tag
    /// </summary>
    /// <param name="options"></param>
    /// <param name="expression"></param>
    public static void EnableFilter(this ApiSkinOptions options, string expression = null)
    {
        options.ConfigObject.Filter = expression ?? "";
    }

    /// <summary>
    ///     You can use this parameter to enable the swagger-ui's built-in validator (badge) functionality
    ///     Setting it to null will disable validation
    /// </summary>
    /// <param name="options"></param>
    /// <param name="url"></param>
    public static void EnableValidator(this ApiSkinOptions options, string url = "https://online.swagger.io/validator")
    {
        options.ConfigObject.ValidatorUrl = url;
    }

    /// <summary>
    ///     Injects additional Javascript files into the index.html page
    /// </summary>
    /// <param name="options"></param>
    /// <param name="path">A path to the javascript - i.e. the script "src" attribute</param>
    /// <param name="type">The script type - i.e. the script "type" attribute</param>
    public static void InjectJavascript(this ApiSkinOptions options, string path, string type = "text/javascript")
    {
        var builder = new StringBuilder(options.HeadContent);
        builder.AppendLine(CultureInfo.InvariantCulture, $"<script src='{path}' type='{type}'></script>");
        options.HeadContent = builder.ToString();
    }

    /// <summary>
    ///     Injects additional CSS stylesheets into the index.html page
    /// </summary>
    /// <param name="options"></param>
    /// <param name="path">A path to the stylesheet - i.e. the link "href" attribute</param>
    /// <param name="media">The target media - i.e. the link "media" attribute</param>
    public static void InjectStylesheet(this ApiSkinOptions options, string path, string media = "screen")
    {
        var builder = new StringBuilder(options.HeadContent);
        builder.AppendLine(CultureInfo.InvariantCulture, $"<link href='{path}' rel='stylesheet' media='{media}' type='text/css' />");
        options.HeadContent = builder.ToString();
    }

    /// <summary>
    ///     Limits the number of tagged operations displayed to at most this many. The default is to show all operations
    /// </summary>
    /// <param name="options"></param>
    /// <param name="count"></param>
    public static void MaxDisplayedTags(this ApiSkinOptions options, int count)
    {
        options.ConfigObject.MaxDisplayedTags = count;
    }

    /// <summary>
    ///     OAuth redirect URL
    /// </summary>
    /// <param name="options"></param>
    /// <param name="url"></param>
    public static void OAuth2RedirectUrl(this ApiSkinOptions options, string url)
    {
        options.ConfigObject.OAuth2RedirectUrl = url;
    }

    /// <summary>
    ///     Additional query parameters added to authorizationUrl and tokenUrl
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthAdditionalQueryStringParams(this ApiSkinOptions options, Dictionary<string, string> value)
    {
        options.OAuthConfigObject.AdditionalQueryStringParams = value;
    }

    /// <summary>
    ///     Application name, displayed in authorization popup
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthAppName(this ApiSkinOptions options, string value)
    {
        options.OAuthConfigObject.AppName = value;
    }

    /// <summary>
    ///     Default clientId
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthClientId(this ApiSkinOptions options, string value)
    {
        options.OAuthConfigObject.ClientId = value;
    }

    /// <summary>
    ///     Default clientSecret
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthClientSecret(this ApiSkinOptions options, string value)
    {
        options.OAuthConfigObject.ClientSecret = value;
    }

    /// <summary>
    ///     realm query parameter (for oauth1) added to authorizationUrl and tokenUrl
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthRealm(this ApiSkinOptions options, string value)
    {
        options.OAuthConfigObject.Realm = value;
    }

    /// <summary>
    ///     Scope separator for passing scopes, encoded before calling, default value is a space (encoded value %20)
    /// </summary>
    /// <param name="options"></param>
    /// <param name="value"></param>
    [Obsolete("Obsolete")]
    public static void OAuthScopeSeparator(this ApiSkinOptions options, string value)
    {
        options.OAuthConfigObject.ScopeSeparator = value;
    }

    /// <summary>
    ///     Only activated for the accessCode flow. During the authorization_code request to the tokenUrl,
    ///     pass the Client Password using the HTTP Basic Authentication scheme (Authorization header with
    ///     Basic base64encoded[client_id:client_secret]). The default is false
    /// </summary>
    /// <param name="options"></param>
    [Obsolete("Obsolete")]
    public static void OAuthUseBasicAuthenticationWithAccessCodeGrant(this ApiSkinOptions options)
    {
        options.OAuthConfigObject.UseBasicAuthenticationWithAccessCodeGrant = true;
    }

    /// <summary>
    ///     Only applies to authorizatonCode flows. Proof Key for Code Exchange brings enhanced security for OAuth public clients.
    ///     The default is false
    /// </summary>
    /// <param name="options"></param>
    [Obsolete("Obsolete")]
    public static void OAuthUsePkce(this ApiSkinOptions options)
    {
        options.OAuthConfigObject.UsePkceWithAuthorizationCodeGrant = true;
    }

    /// <summary>
    ///     Controls the display of extensions (pattern, maxLength, minLength, maximum, minimum) fields and values for Parameters
    /// </summary>
    /// <param name="options"></param>
    public static void ShowCommonExtensions(this ApiSkinOptions options)
    {
        options.ConfigObject.ShowCommonExtensions = true;
    }

    /// <summary>
    ///     Controls the display of vendor extension (x-) fields and values for Operations, Parameters, and Schema
    /// </summary>
    /// <param name="options"></param>
    public static void ShowExtensions(this ApiSkinOptions options)
    {
        options.ConfigObject.ShowExtensions = true;
    }

    /// <summary>
    ///     List of HTTP methods that have the Try it out feature enabled. An empty array disables Try it out for all operations.
    ///     This does not filter the operations from the display
    /// </summary>
    /// <param name="options"></param>
    /// <param name="submitMethods"></param>
    public static void SupportedSubmitMethods(this ApiSkinOptions options, params SubmitMethod[] submitMethods)
    {
        options.ConfigObject.SupportedSubmitMethods = submitMethods;
    }

    /// <summary>
    ///     Adds Swagger JSON endpoints. Can be fully-qualified or relative to the UI page
    /// </summary>
    /// <param name="options"></param>
    /// <param name="url">Can be fully qualified or relative to the current host</param>
    /// <param name="name">The description that appears in the document selector drop-down</param>
    public static void SwaggerEndpoint(this ApiSkinOptions options, string url, string name)
    {
        var urls = new List<UrlDescriptor>(options.ConfigObject.Urls ?? []) { new() { Url = url, Name = name } };
        options.ConfigObject.Urls = urls;
    }

    [Obsolete("The validator is disabled by default. Use EnableValidator to enable it")]
    public static void ValidatorUrl(this ApiSkinOptions options, string url)
    {
        options.ConfigObject.ValidatorUrl = url;
    }
}