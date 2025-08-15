using Application.Exceptions;
using Application.Contracts;
using Application.Interfaces;
using Domain.Entities;
using BCrypt.Net;

namespace Application.UseCases
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Users>> GetAllUsers()
        {
            var users = await _repo.GetAllUsers();
            if (users == null || !users.Any())
                throw new BusinessException("No users found.");
            return users;
        }

        public async Task<Users> GetUserById(int id)
        {
            var user = await _repo.GetUserById(id);
            if (user == null)
                throw new BusinessException("User not found.");
            return user;
        }

        public async Task CreateUser(Users user)
        {
            var existingUser = await _repo.GetUserByEmail(user.Email);
            if (existingUser != null)
            {
                throw new BusinessException("User with this email already exists.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            try
            {
                await _repo.AddUser(user);
            }
            catch (Exception ex)
            {
                throw new BusinessException("An error occurred while creating the user.", ex);
            }
        }

        public async Task UpdateUser(Users user)
        {
            var existingUser = await _repo.GetUserById(user.Id);
            if (existingUser == null)
                throw new BusinessException("User not found.");

            existingUser.FirstName = user.FirstName ?? existingUser.FirstName;
            existingUser.LastName = user.LastName ?? existingUser.LastName;
            existingUser.Email = user.Email ?? existingUser.Email;
            existingUser.Country = user.Country ?? existingUser.Country;
            existingUser.Role = user.Role ?? existingUser.Role;
            existingUser.IsActive = user.IsActive;
            existingUser.IsDeleted = user.IsDeleted;


            await _repo.UpdateUser(existingUser);
        }

        public async Task DeleteUser(int userId)
        {
            var user = await _repo.GetUserById(userId);
            if (user == null)
                throw new BusinessException("User not found.");


            user.IsDeleted = true;
            await _repo.UpdateUser(user);
        }

        public async Task<Users?> GetUserByEmail(string email)
        {
            var user = await _repo.GetUserByEmail(email);

            return user;

        }

        public async Task ChangePassword(int userId, string currentPassword, string newPassword)
        {
            var user = await _repo.GetUserById(userId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                throw new BusinessException("Invalid current password.");

            if (!IsValidPassword(newPassword))
                throw new BusinessException("Password does not meet complexity requirements.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _repo.UpdateUser(user);
        }

        private bool IsValidPassword(string password)
        {
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => "!@#$%^&*".Contains(ch));
        }

        public async Task<string?> GeneratePasswordResetToken(string email)
        {
            var user = await _repo.GetUserByEmail(email);
            if (user == null)
                throw new BusinessException("User not found.");

            var token = Guid.NewGuid().ToString();
            user.Token = token;

            await _repo.UpdateUser(user);
            return token;
        }

        public async Task<bool> ResetPassword(string token, string newPassword)
        {
            var user = await _repo.GetUserByToken(token);
            if (user == null)
                throw new BusinessException("User not found.");

            if (!IsValidPassword(newPassword)) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.Token = string.Empty;

            await _repo.UpdateUser(user);
            return true;
        }

        public async Task ChangeUserRole(int userId, string newRole)
        {
            var user = await _repo.GetUserById(userId);
            if (user == null)
                throw new BusinessException("User not found.");

            user.Role = newRole;
            await _repo.UpdateUser(user);
        }

        public async Task DeactivateUser(int userId)
        {
            var user = await _repo.GetUserById(userId);
            if (user == null)
                throw new BusinessException("User not found.");

            user.IsActive = false;
            await _repo.UpdateUser(user);
        }

        public async Task ActivateUser(int userId)  
        {
            var user = await _repo.GetUserById(userId);
            if (user == null)
                throw new BusinessException("User not found.");

            user.IsActive = true;
            await _repo.UpdateUser(user);
        }
    }
}
