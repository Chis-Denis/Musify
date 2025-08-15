using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Musify.Tests.Repositories
{
    public class UserRepositoryTests
    {
        private readonly MusifyDbContext _context;
        private readonly UserRepository _repository;

        public UserRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MusifyDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new MusifyDbContext(options);
            _context.Database.EnsureCreated();
            _repository = new UserRepository(_context);

            SeedData();
        }

        private void SeedData()
        {
            _context.Users.RemoveRange(_context.Users);

            _context.Users.AddRange(new List<Users>
            {
                new Users
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john@example.com",
                    PasswordHash = "hashed_password",
                    Country = "USA",
                    Role = "user",
                    IsActive = true,
                    IsDeleted = false,
                    Token = ""
                },
                new Users
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane@example.com",
                    PasswordHash = "hashed_password",
                    Country = "Canada",
                    Role = "admin",
                    IsActive = true,
                    IsDeleted = true,
                    Token = ""
                }
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturnOnlyNonDeletedUsers()
        {
            var users = await _repository.GetAllUsers();
            Assert.Single(users);
        }

        [Fact]
        public async Task GetUserById_ShouldReturnUser()
        {
            var user = await _repository.GetUserById(1);
            Assert.NotNull(user);
            Assert.Equal("John", user.FirstName);
        }

        [Fact]
        public async Task AddUser_ShouldAddUser()
        {
            var newUser = new Users
            {
                Id = 3,
                FirstName = "Alice",
                LastName = "Cooper",
                Email = "alice@example.com",
                PasswordHash = "hashed_password",
                Country = "UK",
                Role = "user",
                IsActive = true,
                IsDeleted = false,
                Token = ""
            };

            await _repository.AddUser(newUser);

            var user = await _repository.GetUserByEmail("alice@example.com");
            Assert.NotNull(user);
            Assert.Equal("Alice", user.FirstName);
        }

        [Fact]
        public async Task UpdateUser_ShouldModifyExistingUser()
        {
            var user = await _repository.GetUserById(1);
            user.FirstName = "Johnny";
            await _repository.UpdateUser(user);

            var updatedUser = await _repository.GetUserById(1);
            Assert.Equal("Johnny", updatedUser.FirstName);
        }

        [Fact]
        public async Task UpdateUser_ShouldNotThrow_ForDeletedUser()
        {
            var deletedUser = new Users
            {
                Id = 4,
                FirstName = "Ghost",
                LastName = "User",
                Email = "ghost@example.com",
                PasswordHash = "hash",
                Country = "Nowhere",
                Role = "user",
                IsActive = true,
                IsDeleted = true,
                Token = ""
            };

            _context.Users.Add(deletedUser);
            await _context.SaveChangesAsync();

            deletedUser.FirstName = "Phantom";
            await _repository.UpdateUser(deletedUser);

            var fetchedUser = await _repository.GetUserByEmail("ghost@example.com");
            Assert.Null(fetchedUser); // still null due to filter
        }

        [Fact]
        public async Task GetUserByEmail_ShouldReturnCorrectUser()
        {
            var user = await _repository.GetUserByEmail("john@example.com");
            Assert.NotNull(user);
            Assert.Equal("John", user.FirstName);
        }

        [Fact]
        public async Task GetUserByEmail_ShouldReturnNull_IfUserIsDeleted()
        {
            var user = await _repository.GetUserByEmail("jane@example.com");
            Assert.Null(user);
        }

        [Fact]
        public async Task GetUserByToken_ShouldReturnCorrectUser()
        {
            var user = await _repository.GetUserById(1);
            user.Token = "resettoken123";
            await _repository.UpdateUser(user);

            var result = await _repository.GetUserByToken("resettoken123");
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
        }
    }
}
