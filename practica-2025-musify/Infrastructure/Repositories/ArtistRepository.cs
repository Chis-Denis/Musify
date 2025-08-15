using Domain.Entities;
using Infrastructure.Data;
using Application.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ArtistRepository: IArtistRepository
    {
        private readonly MusifyDbContext _context;

        public  ArtistRepository(MusifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Artists>> GetAllArtists()
        {
            return await _context.Artists
                                .Where(a => a.Type == "person")
                                .Include(a => a.Members)
                                .Include(a => a.Bands)
                                .Include(a => a.Albums)
                                .Include(a => a.SongArtists)
                                    .ThenInclude(sa => sa.Song)
                                .ToListAsync();
        }

        public async Task<IEnumerable<Artists>> GetAll()
        {
            return await _context.Artists
                                .Include(a => a.Members)
                                .Include(a => a.Bands)
                                .Include(a => a.Albums)
                                .Include(a => a.SongArtists)
                                    .ThenInclude(sa => sa.Song)
                                .ToListAsync();
        }

        public async Task<Artists?> GetArtistById(int id)
        {
            return await _context.Artists
                .Include(a => a.Members)
                .Include(a => a.Bands)
                .Include(a => a.Albums)
                .Include(a => a.SongArtists)
                     .ThenInclude(sa => sa.Song)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task AddArtist(Artists artist)
        {
            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateArtist(Artists artist)
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteArtist(Artists artist)
        {
            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Artists>> GetAllBands()
        {
            return await _context.Artists.Where(a => a.Type == "band")
                                .Include(a => a.Members)
                                .Include(a => a.Bands)
                                .Include(a => a.Albums)
                                .Include(a => a.SongArtists)
                                    .ThenInclude(sa => sa.Song)
                                .ToListAsync();
        }

        public async Task AddBandMember(Artists band, Artists member)
        {
            band.Members.Add(member);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveBandMember(Artists band, Artists member)
        {
            band.Members.Remove(member);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Artists>> Search(string name)
        {
            name = name.ToLower();

            return await _context.Artists
                        .Include(a => a.Members)
                        .Include(a => a.Bands)
                        .Include(a => a.Albums)
                        .Include(a => a.SongArtists)
                            .ThenInclude(sa => sa.Song)
                        .Where(a =>
                            a.FirstName.ToLower().Contains(name) ||
                            a.LastName.ToLower().Contains(name) ||
                            a.StageName.ToLower().Contains(name) ||
                            a.BandName.ToLower().Contains(name)
                        )
                        .ToListAsync();
        }

    }
}
