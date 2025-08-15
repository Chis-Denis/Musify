using Application.Contracts;
using Application.Exceptions;
using Application.UseCases;
using Domain.Entities;
using Moq;
using Xunit;

namespace Musify.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _repoMock;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _repoMock = new Mock<IUserRepository>();
            _service = new UserService(_repoMock.Object);
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturnUsers_WhenExists()
        {
            var users = new List<Users> { new Users { Id = 1 }, new Users { Id = 2 } };
            _repoMock.Setup(r => r.GetAllUsers()).ReturnsAsync(users);

            var result = await _service.GetAllUsers();

            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAllUsers_ShouldThrowException_WhenNoneFound()
        {
            _repoMock.Setup(r => r.GetAllUsers()).ReturnsAsync(new List<Users>());

            await Assert.ThrowsAsync<BusinessException>(() => _service.GetAllUsers());
        }

        [Fact]
        public async Task GetUserById_ShouldReturnUser_WhenExists()
        {
            var user = new Users { Id = 1 };
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            var result = await _service.GetUserById(1);

            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task GetUserById_ShouldThrowException_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.GetUserById(1));
        }

        [Fact]
        public async Task UpdateUser_ShouldThrowException_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync((Users?)null);

            var userToUpdate = new Users { Id = 1, Email = "new@email.com" };

            await Assert.ThrowsAsync<BusinessException>(() => _service.UpdateUser(userToUpdate));
        }

        [Fact]
        public async Task UpdateUser_ShouldUpdateFields_WhenUserExists()
        {
            var existingUser = new Users
            {
                Id = 1,
                FirstName = "Old",
                LastName = "Old",
                Email = "old@email.com",
                Country = "Old",
                Role = "user",
                IsActive = false,
                IsDeleted = false
            };

            var updated = new Users
            {
                Id = 1,
                FirstName = "New",
                LastName = "New",
                Email = "new@email.com",
                Country = "New",
                Role = "admin",
                IsActive = true,
                IsDeleted = true
            };

            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(existingUser);

            await _service.UpdateUser(updated);

            _repoMock.Verify(r => r.UpdateUser(It.Is<Users>(u =>
                u.FirstName == "New" &&
                u.LastName == "New" &&
                u.Email == "new@email.com" &&
                u.Country == "New" &&
                u.Role == "admin" &&
                u.IsActive &&
                u.IsDeleted
            )), Times.Once);
        }

        [Fact]
        public async Task GetUserByEmail_ShouldReturnUser_WhenExists()
        {
            var user = new Users { Email = "found@example.com" };
            _repoMock.Setup(r => r.GetUserByEmail("found@example.com")).ReturnsAsync(user);

            var result = await _service.GetUserByEmail("found@example.com");

            Assert.Equal("found@example.com", result!.Email);
        }

        [Fact]
        public async Task ResetPassword_ShouldSucceed_WhenValid()
        {
            var user = new Users { Token = "abc123" };
            _repoMock.Setup(r => r.GetUserByToken("abc123")).ReturnsAsync(user);

            Users? updatedUser = null;
            _repoMock.Setup(r => r.UpdateUser(It.IsAny<Users>()))
                     .Callback<Users>(u => updatedUser = u);

            var result = await _service.ResetPassword("abc123", "Valid1@Pass");

            Assert.True(result);
            Assert.NotNull(updatedUser);
            Assert.Equal(string.Empty, updatedUser!.Token);
            Assert.True(BCrypt.Net.BCrypt.Verify("Valid1@Pass", updatedUser.PasswordHash));
        }

        [Fact]
        public async Task ResetPassword_ShouldThrowException_WhenUserNotFound()
        {
            _repoMock.Setup(r => r.GetUserByToken("invalid")).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.ResetPassword("invalid", "Valid1@Pass"));
        }

        [Fact]
        public async Task ChangeUserRole_ShouldUpdateRole_WhenUserExists()
        {
            var user = new Users { Id = 1, Role = "user" };
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            await _service.ChangeUserRole(1, "admin");

            Assert.Equal("admin", user.Role);
            _repoMock.Verify(r => r.UpdateUser(user), Times.Once);
        }

        [Fact]
        public async Task ChangeUserRole_ShouldThrowException_WhenUserNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(99)).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.ChangeUserRole(99, "admin"));
        }

        [Fact]
        public async Task CreateUser_Should_ThrowException_IfEmailExists()
        {
            var existingUser = new Users { Email = "test@example.com" };
            _repoMock.Setup(r => r.GetUserByEmail("test@example.com")).ReturnsAsync(existingUser);

            var newUser = new Users { Email = "test@example.com", PasswordHash = "abc" };

            await Assert.ThrowsAsync<BusinessException>(() => _service.CreateUser(newUser));
        }

        [Fact]
        public async Task CreateUser_Should_AddUser_IfEmailNotExists()
        {
            var newUser = new Users { Email = "new@example.com", PasswordHash = "abc" };
            _repoMock.Setup(r => r.GetUserByEmail("new@example.com")).ReturnsAsync((Users?)null);

            await _service.CreateUser(newUser);

            _repoMock.Verify(r => r.AddUser(It.IsAny<Users>()), Times.Once);
        }

        [Fact]
        public async Task DeleteUser_Should_ThrowException_IfUserNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(99)).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.DeleteUser(99));
        }

        [Fact]
        public async Task DeleteUser_Should_MarkUserAsDeleted()
        {
            var user = new Users { Id = 1, IsDeleted = false };
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            await _service.DeleteUser(1);

            Assert.True(user.IsDeleted);
            _repoMock.Verify(r => r.UpdateUser(user), Times.Once);
        }

        [Fact]
        public async Task ChangePassword_Should_ThrowException_IfUserNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.ChangePassword(1, "old", "NewPass123!"));
        }

        [Fact]
        public async Task ChangePassword_Should_ThrowException_IfPasswordInvalid()
        {
            var user = new Users
            {
                Id = 1,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct") // Valid hash
            };

            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            await Assert.ThrowsAsync<BusinessException>(() =>
                _service.ChangePassword(1, "wrong", "NewPass123!"));
        }

        [Fact]
        public async Task ChangePassword_Should_UpdatePassword_WhenValid()
        {
            var user = new Users
            {
                Id = 1,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldPass123!")
            };

            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            Users updatedUser = null!;
            _repoMock.Setup(r => r.UpdateUser(It.IsAny<Users>()))
                     .Callback<Users>(u => updatedUser = u);

            await _service.ChangePassword(1, "oldPass123!", "NewPass123!");

            Assert.NotNull(updatedUser);
            Assert.True(BCrypt.Net.BCrypt.Verify("NewPass123!", updatedUser.PasswordHash));
        }

        [Fact]
        public async Task ChangePassword_Should_ThrowException_IfNewPasswordIsWeak()
        {
            var user = new Users
            {
                Id = 1,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct")
            };

            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            await Assert.ThrowsAsync<BusinessException>(() =>
                _service.ChangePassword(1, "correct", "weak"));
        }

        [Fact]
        public async Task GenerateResetToken_Should_SetToken_IfUserExists()
        {
            var user = new Users { Email = "email@example.com" };
            _repoMock.Setup(r => r.GetUserByEmail("email@example.com")).ReturnsAsync(user);

            var token = await _service.GeneratePasswordResetToken("email@example.com");

            Assert.NotNull(token);
            _repoMock.Verify(r => r.UpdateUser(user), Times.Once);
        }

        [Fact]
        public async Task ResetPassword_Should_ReturnFalse_IfInvalidPassword()
        {
            var user = new Users { Token = "token" };
            _repoMock.Setup(r => r.GetUserByToken("token")).ReturnsAsync(user);

            var result = await _service.ResetPassword("token", "short");

            Assert.False(result);
        }

        [Fact]
        public async Task DeactivateUser_Should_ThrowException_IfUserNotFound()
        {
            _repoMock.Setup(r => r.GetUserById(10)).ReturnsAsync((Users?)null);

            await Assert.ThrowsAsync<BusinessException>(() => _service.DeactivateUser(10));
        }

        [Fact]
        public async Task ActivateUser_Should_Activate_ExistingUser()
        {
            var user = new Users { Id = 1, IsActive = false };
            _repoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);

            await _service.ActivateUser(1);

            Assert.True(user.IsActive);
            _repoMock.Verify(r => r.UpdateUser(user), Times.Once);
        }
    }
}
