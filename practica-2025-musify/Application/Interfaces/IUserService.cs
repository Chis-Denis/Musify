using Domain.Entities;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<Users>> GetAllUsers();
        Task<Users> GetUserById(int id);
        Task CreateUser(Users user);
        Task UpdateUser(Users user);
        Task DeleteUser(int userid);
        Task<Users?> GetUserByEmail(string email);
        Task ChangePassword(int userId, string currentPassword, string newPassword);
        Task<string?> GeneratePasswordResetToken(string email);
        Task<bool> ResetPassword(string token, string newPassword);
        Task ChangeUserRole(int userId, string newRole);
        Task DeactivateUser(int userId);
        Task ActivateUser(int userId);

    }
}
