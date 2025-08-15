using Domain.Entities;

namespace Application.Contracts
{
    public interface IUserRepository
    {
        Task<IEnumerable<Users>> GetAllUsers();
        Task<Users> GetUserById(int id);
        Task AddUser(Users user);
        Task UpdateUser(Users user);
        Task<Users?> GetUserByEmail(string email);
        Task<Users?> GetUserByToken(string token);

    }
}
