using Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Musify.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Musify.Helpers
{
    public class JwtTokenGenerator
    {
        private readonly JwtOptions _jwtOptions;

        public JwtTokenGenerator(IOptions<JwtOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
        }

        public string GenerateToken(Users user)
        {
            //information embedded directly into the token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
            };

            //an onject type SymmetricSecurityKey created from the jwt secret key endcoded into bytes (symmetric - same key used for signing and validating the token)
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)!);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //key created is hashed and transf. into the digital signature credentials (This ensures - the token has not been tampered with.)

            //the effective construction of the key
            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer, //who created
                audience: _jwtOptions.Audience, //for who #"musify-users"
                claims: claims, //what
                expires: DateTime.UtcNow.AddHours(_jwtOptions.ExpiryHours), //for how much time viable
                signingCredentials: creds //digital signature
            );

            //returned as a jwt string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
