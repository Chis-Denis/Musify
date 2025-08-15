using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MusifyDbContext _context;

        public UserRepository(MusifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Users>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<Users> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);

        }

        public async Task AddUser(Users user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(Users user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<Users?> GetUserByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

        }

        public async Task<Users?> GetUserByToken(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Token == token);

        }
    }
}
