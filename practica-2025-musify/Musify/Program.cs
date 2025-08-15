using Application.Contracts;
using Application.Interfaces;
using Application.UseCases;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Musify.Helpers;
using Musify.Options;
using Musify.Validations;
using System.Text;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<DbSettings>(builder.Configuration.GetSection(ConfigurationKeys.ConnectionString));


builder.Services.AddDbContext<MusifyDbContext>((serviceProvider, options) =>
{
    var dbSettings = serviceProvider.GetRequiredService<IOptions<DbSettings>>().Value;

    options.UseSqlServer(dbSettings.DefaultConnection);
});

builder.Services.Configure<CorsSettings>(
    builder.Configuration.GetSection(ConfigurationKeys.Cors)
);

var corsSettings = builder.Configuration
    .GetSection(ConfigurationKeys.Cors)
    .Get<CorsSettings>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(ConfigurationKeys.Jwt));

builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddPolicy(ConfigurationKeys.Frontend, policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (origin.StartsWith("http://localhost"))
                    return true;

                //Wildcard pattern like *.azurewebsites.net 
                if (origin.EndsWith(".azurewebsites.net"))
                    return true;

                //For specific urls from appsettings.
                return corsSettings.AllowedOrigins.Contains(origin);
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});



builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Musify API", Version = "v1" });

    c.AddSecurityDefinition(ConfigurationKeys.SwaggerBearerSchemeId, new OpenApiSecurityScheme
    {
        Name = ConfigurationKeys.BearerName, 
        Type = SecuritySchemeType.ApiKey,
        Scheme = ConfigurationKeys.SwaggerBearerSchemeId, 
        BearerFormat = ConfigurationKeys.BearerFormat, 
        In = ParameterLocation.Header,
        Description = ConfigurationKeys.BearerDescription
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = ConfigurationKeys.SwaggerBearerSchemeId 
                }
            },
            Array.Empty<string>()
        }
    });
});



// Register repositories and services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IArtistService, ArtistService>();

builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();
builder.Services.AddScoped<IPlaylistService, PlaylistService>();

builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IAlbumService, AlbumService>();

builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<ISongService, SongService>();

builder.Services.AddScoped<AlbumControllerValidator>();




//helpers
builder.Services.AddScoped<JwtTokenGenerator>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtOptions = builder.Configuration.GetSection(ConfigurationKeys.Jwt).Get<JwtOptions>();

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, //from the correct api
        ValidateAudience = true, //meant for this api
        ValidateLifetime = true, // check if expired
        ValidateIssuerSigningKey = true, //check if token was made with the secretkey
        ValidIssuer = jwtOptions.Issuer,
        ValidAudience = jwtOptions.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtOptions.Key)), //provides the actual secret key
        ClockSkew = TimeSpan.Zero //almost expired not allowed
    };
});
builder.Services.AddSingleton<IExceptionHandler, GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
var app = builder.Build();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(ConfigurationKeys.Frontend);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();