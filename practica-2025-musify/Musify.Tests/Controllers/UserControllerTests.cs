using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Musify.Controllers;
using Musify.DTOs.UserDTOs;
using Musify.Mapping;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace Musify.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _serviceMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _serviceMock = new Mock<IUserService>();
            _controller = new UserController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetUser_ShouldReturnOkWithUsers()
        {
            var users = new List<Users> { new Users { Id = 1 }, new Users { Id = 2 } };
            _serviceMock.Setup(s => s.GetAllUsers()).ReturnsAsync(users);

            var result = await _controller.GetUser();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<UserReadDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetUserById_ShouldReturnOkWithUser()
        {
            var user = new Users { Id = 1, FirstName = "Test" };
            _serviceMock.Setup(s => s.GetUserById(1)).ReturnsAsync(user);

            var result = await _controller.GetUserById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<UserReadDto>(okResult.Value);
            Assert.Equal(1, returnValue.Id);
        }

        [Fact]
        public async Task CreateUser_ShouldReturnCreatedAt()
        {
            var dto = new UserCreateDto { FirstName = "Test", Email = "test@test.com", Password = "Abc123$%", Role = "user" };

            var result = await _controller.CreateUser(dto);

            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<UserReadDto>(createdAtResult.Value);
            Assert.Equal(dto.Email, returnValue.Email);
        }

        [Fact]
        public async Task CreateUser_ShouldThrowBusinessException_WhenEmailAlreadyExists()
        {
            var dto = new UserCreateDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "exists@example.com",
                Password = "Abc123$%",
                Role = "user"
            };

            _serviceMock
                .Setup(s => s.CreateUser(It.IsAny<Users>()))
                .ThrowsAsync(new BusinessException("Email already exists."));

            await Assert.ThrowsAsync<BusinessException>(() => _controller.CreateUser(dto));
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnNoContent()
        {
            var dto = new UserUpdateDto { Id = 1 };

            var result = await _controller.UpdateUser(1, dto);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnBadRequest_WhenIdMismatch()
        {
            var dto = new UserUpdateDto { Id = 2 };
            var result = await _controller.UpdateUser(1, dto);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User ID mismatch.", badRequest.Value);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnNoContent()
        {
            _serviceMock.Setup(s => s.GetUserById(1)).ReturnsAsync(new Users { Id = 1 });

            var result = await _controller.DeleteUser(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnOk_WhenSuccessful()
        {
            // Arrange
            var controller = new UserController(_serviceMock.Object);
            var userId = 123;

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var dto = new ChangePasswordDto
            {
                CurrentPassword = "OldPass123!",
                NewPassword = "NewPass123!"
            };

            // Act
            var result = await controller.ChangePassword(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            // Use reflection to get the 'message' property from the anonymous object
            var value = okResult.Value;
            var messageProp = value.GetType().GetProperty("message");
            Assert.NotNull(messageProp);
            Assert.Equal("Password changed successfully.", messageProp.GetValue(value));
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_OnError()
        {
            // Arrange
            var controller = new UserController(_serviceMock.Object);
            var userId = 123;

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            _serviceMock.Setup(s => s.ChangePassword(userId, It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new BusinessException("Invalid password."));

            var dto = new ChangePasswordDto
            {
                CurrentPassword = "Old",
                NewPassword = "short"
            };

            // Act
            var result = await controller.ChangePassword(dto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);

            // Use reflection to get the 'message' property from the anonymous object
            var value = badRequest.Value;
            var messageProp = value.GetType().GetProperty("message");
            Assert.NotNull(messageProp);
            Assert.Equal("Invalid password.", messageProp.GetValue(value));
        }

        [Fact]
        public async Task ChangeUserRole_ShouldReturnOk()
        {
            var result = await _controller.ChangeUserRole(1, "admin");

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeactivateUser_ShouldReturnOk()
        {
            var result = await _controller.DeactivateUser(1);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task ActivateUser_ShouldReturnOk()
        {
            var result = await _controller.ActivateUser(1);

            Assert.IsType<OkResult>(result);
        }
    }
}
