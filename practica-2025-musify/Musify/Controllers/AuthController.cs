using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Musify.DTOs.Security;
using Musify.DTOs.UserDTOs;
using Musify.Helpers;
using Musify.Mapping;

namespace Musify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("Users ")]
    [ApiConventionType(typeof(DefaultApiConventions))]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthController(IUserService userService, JwtTokenGenerator jwtTokenGenerator)
        {
            _userService = userService;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            var existingUser = await _userService.GetUserByEmail(dto.Email);
            if (existingUser != null)
                return BadRequest("Email already exists.");

            var user = dto.ToEntity();

            await _userService.CreateUser(user);
            return Ok(new { message = "User registered successfully." });

        }

        [AllowAnonymous]
        [HttpPost("login")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var user = await _userService.GetUserByEmail(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var token = _jwtTokenGenerator.GenerateToken(user);

            user.Token = token;
            await _userService.UpdateUser(user);

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName
                }
            });
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var token = await _userService.GeneratePasswordResetToken(dto.Email);
            if (token == null)
                return NotFound("User not found");

            // simulate email sending
            return Ok(new { Message = "Password reset token generated", Token = token });
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]    
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var success = await _userService.ResetPassword(dto.Token, dto.NewPassword);
            return success ? Ok(new { message = "Password reset successful" }) : BadRequest(new { message = "Invalid token or password." });
        }
    }
}
