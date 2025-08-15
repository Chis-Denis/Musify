using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Musify.DTOs.UserDTOs;
using Musify.Mapping;

namespace Musify.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [ApiConventionType(typeof(DefaultApiConventions))]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)] 
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUser()
        {
            var users = await _userService.GetAllUsers();
            var userDtos = users.Select(u => u.ToDto());
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserReadDto>> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            var userDto = user.ToDto();
            return Ok(userDto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            var user = dto.ToEntity();
            await _userService.CreateUser(user);
            var resultDto = user.ToDto();
            return CreatedAtAction(nameof(GetUser), new { id = resultDto.Id }, resultDto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest("User ID mismatch.");

            var updatedUser = dto.ToEntity();
            await _userService.UpdateUser(updatedUser);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUser(id);
            return NoContent();
        }

        [HttpPut("change-password")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            try
            {
                await _userService.ChangePassword(userId, dto.CurrentPassword, dto.NewPassword);
                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message  = ex.Message});
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}/change-role")]
        [ProducesResponseType(StatusCodes.Status200OK)] 
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] string newRole)
        {
            await _userService.ChangeUserRole(id, newRole);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}/deactivate")]
        [ProducesResponseType(StatusCodes.Status200OK)] 
        public async Task<IActionResult> DeactivateUser(int id)
        {
            await _userService.DeactivateUser(id);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}/activate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ActivateUser(int id)
        {
            await _userService.ActivateUser(id);
            return Ok();
        }
    }
}
