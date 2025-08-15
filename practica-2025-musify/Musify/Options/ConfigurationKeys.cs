namespace Musify.Options
{
    public static class ConfigurationKeys
    {
        public const string ConnectionString = "ConnectionStrings";
        public const string DefaultConnection = "DefaultConnection";

        public const string Jwt = "Jwt";
        public const string JwtSecurityScheme = "JwtSecurityScheme";

        public const string Frontend = "AllowFrontend";

        public const string SwaggerBearerSchemeId = "Bearer";
        public const string BearerFormat = "JWT";
        public const string BearerName = "Authorization";
        public const string BearerDescription = "Enter 'Bearer' [space] and then your token.\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...";

        public const string ApplicationJson = "application/json";

        public const string Cors = "Cors";

    }
}
