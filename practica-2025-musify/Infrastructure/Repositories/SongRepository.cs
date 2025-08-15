using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly MusifyDbContext _context = null!;

        public SongRepository(MusifyDbContext context)
        {
            this._context = context;
        }

        public async Task<IEnumerable<Songs>> GetAllSongs()
        {
            return await _context.Songs
                    .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                    .ToListAsync();
        }

        public async Task<Songs?> GetSongById(int id)
        {
            return await _context.Songs.FindAsync(id).AsTask();
        }

        public async Task<Songs?> GetSongByIdWithArtists(int id)
        {
            return await _context.Songs
                .Include(s => s.SongArtists)
                .ThenInclude(sa => sa.Artist)
                .FirstOrDefaultAsync(s => s.Id == id);
        }


        public async Task<Songs> AddSong(Songs song)
        {
            await _context.Songs.AddAsync(song);
            await SaveChanges();
            return song;
        }

        public async Task UpdateSong(Songs song)
        {
            await SaveChanges();
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSong(Songs song)
        {
            _context.Songs.Remove(song);
            await SaveChanges();
        }

        public async Task<IEnumerable<Songs>> SearchSongsByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return Enumerable.Empty<Songs>();

            var pattern = $"%{name}%";

            var songs = await _context.Songs
                .Include(s => s.AlternativeTitles)
                .Include(s => s.SongArtists)
                .ThenInclude(sa => sa.Artist)
                .Where(s =>
                    EF.Functions.Like(s.Title, pattern)
                    || s.AlternativeTitles.Any(at =>
                        at.AlternativeTitle != null
                        && EF.Functions.Like(at.AlternativeTitle, pattern)
                    )
                )
                .AsNoTracking()
                .ToListAsync();

            foreach (var song in songs)
            {
                foreach (var alt in song.AlternativeTitles)
                {
                    alt.Song = null!;
                }
            }

            return songs;
        }



        public async Task<Songs?> GetByIdWithAlternatives(int id)
        {
            return await _context.Songs
                .Include(s => s.AlternativeTitles)
                .Include(s => s.SongArtists)
                .ThenInclude(sa => sa.Artist)
                .FirstOrDefaultAsync(s => s.Id == id);
        }


        public async Task<IEnumerable<Songs>> GetTrendingSongs()
        {
            return await _context.Songs
                .OrderByDescending(s => s.PlaylistSongs.Count)
                .Take(10)
                .Include(s => s.SongArtists)
                .ThenInclude(sa => sa.Artist)
                .ToListAsync();
        }

        public async Task<IEnumerable<Songs>> GetAllArtistSongs(int artistId)
        {
            return await _context.Songs
                      .Where(s => s.SongArtists.Any(sa => sa.ArtistId == artistId))
                      .Include(s => s.SongArtists)
                      .ThenInclude(sa => sa.Artist)
                      .ToListAsync();

        }

        public async Task RemoveSongArtists(IEnumerable<SongArtists> songArtists)
        {
            _context.SongArtists.RemoveRange(songArtists);
            await SaveChanges();
        }

        public async Task AddSongArtists(IEnumerable<SongArtists> songArtists)
        {
            _context.Set<SongArtists>().AddRange(songArtists);
            await SaveChanges();
        }

    }
}
