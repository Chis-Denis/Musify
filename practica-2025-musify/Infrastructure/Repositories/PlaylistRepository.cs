using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly MusifyDbContext _context;

        public PlaylistRepository(MusifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Playlists>> GetAllPlaylists()
        {
            return await _context.Playlists.ToListAsync();
        }

        public async Task<Playlists?> GetPlaylistById(int playlistId)
        {
            return await _context.Playlists.FindAsync(playlistId);
        }

        public async Task CreatePlaylist(Playlists playlist)
        {
            await _context.Playlists.AddAsync(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePlaylist(Playlists playlist)
        {
            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlaylist(int playlistId)
        {
            var playlist = await _context.Playlists.FindAsync(playlistId);
            if (playlist == null)
                return;

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<PlaylistSongs>> GetSongsInPlaylist(int playlistId)
        {
            return await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId)
                .Include(ps => ps.Song)
                .ToListAsync();
        }

        public async Task AddSongToPlaylist(int playlistId, int songId)
        {
            var exists = await _context.PlaylistSongs
                .AnyAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (exists)
                return;

            var positions = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId)
                .Select(ps => ps.Position)
                .ToListAsync();

            var maxPosition = positions.Any() ? positions.Max() : 0;

            var newEntry = new PlaylistSongs
            {
                PlaylistId = playlistId,
                SongId = songId,
                Position = maxPosition + 1
            };

            await _context.PlaylistSongs.AddAsync(newEntry);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var entry = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (entry == null)
                return;

            int removedPosition = entry.Position ?? 0;

            _context.PlaylistSongs.Remove(entry);

            var songsToUpdate = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId && ps.Position > removedPosition)
                .ToListAsync();

            foreach (var ps in songsToUpdate)
            {
                if (ps.Position != null)
                    ps.Position -= 1;
            }

            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsUserFollowingPlaylist(int playlistId, int userId)
        {
            return await _context.PlaylistFollowers
                .AnyAsync(f => f.PlaylistId == playlistId && f.UserId == userId);
        }
        public async Task<bool> AlbumExists(int albumId)
        {
            return await _context.Albums.AnyAsync(a => a.Id == albumId);
        }

        public async Task<Albums?> GetAlbumWithSongs(int albumId)
        {
            return await _context.Albums
                .Include(a => a.AlbumSongs)
                .ThenInclude(asg => asg.Song)
                .FirstOrDefaultAsync(a => a.Id == albumId);
        }

        public async Task AddAlbumSongsToPlaylist(int playlistId, int albumId)
        {
            var album = await GetAlbumWithSongs(albumId);
            if (album == null)
                return;

            var existingSongIds = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId)
                .Select(ps => ps.SongId)
                .ToListAsync();

            int maxPosition = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId)
                .MaxAsync(ps => (int?)ps.Position) ?? 0;

            var newPlaylistSongs = new List<PlaylistSongs>();

            foreach (var albumSong in album.AlbumSongs)
            {
                if (!existingSongIds.Contains(albumSong.SongId))
                {
                    maxPosition++;
                    newPlaylistSongs.Add(new PlaylistSongs
                    {
                        PlaylistId = playlistId,
                        SongId = albumSong.SongId,
                        Position = maxPosition
                    });
                }
            }

            if (newPlaylistSongs.Any())
                await _context.PlaylistSongs.AddRangeAsync(newPlaylistSongs);

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Playlists>> GetPrivatePlaylists()
        {
            return await _context.Playlists
                .Where(p => p.Type.ToLower() == "private")
                .ToListAsync();
        }

        public async Task<IEnumerable<Playlists>> GetPublicPlaylists()
        {
            return await _context.Playlists
                .Where(p => p.Type.ToLower() == "public")
                .ToListAsync();
        }

        public async Task<bool> PlaylistExists(int playlistId)
        {
            return await _context.Playlists.AnyAsync(p => p.Id == playlistId);
        }

        public async Task<IEnumerable<Playlists>> GetFollowedPlaylists(int userId)
        {
            return await _context.PlaylistFollowers
                .Where(f => f.UserId == userId)
                .Include(f => f.Playlist)
                .Select(f => f.Playlist)
                .ToListAsync();
        }

        public async Task UpdatePlaylistSongsOrder(IEnumerable<PlaylistSongs> playlistSongs)
        {
            foreach (var ps in playlistSongs)
            {
                var existing = await _context.PlaylistSongs
                    .FirstOrDefaultAsync(x => x.PlaylistId == ps.PlaylistId && x.SongId == ps.SongId);

                if (existing != null)
                {
                    existing.Position = ps.Position;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task FollowPublicPlaylist(int playlistId, int userId)
        {
            var playlist = await _context.Playlists
                .FirstOrDefaultAsync(p => p.Id == playlistId && p.Type.ToLower() == "public");

            if (playlist == null)
                return;

            var exists = await _context.PlaylistFollowers
                .AnyAsync(pf => pf.PlaylistId == playlistId && pf.UserId == userId);

            if (exists)
                return;

            _context.PlaylistFollowers.Add(new PlaylistFollowers
            {
                PlaylistId = playlistId,
                UserId = userId
            });

            await _context.SaveChangesAsync();
        }

        public async Task UnfollowPublicPlaylist(int playlistId, int userId)
        {
            var existing = await _context.PlaylistFollowers
                .FirstOrDefaultAsync(pf => pf.PlaylistId == playlistId && pf.UserId == userId);

            if (existing == null)
                return;

            _context.PlaylistFollowers.Remove(existing);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Playlists>> SearchPlaylistsByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new List<Playlists>();

            return await _context.Playlists
                .Where(p => p.Name.Contains(name))
                .ToListAsync();
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAlbumFromPlaylist(int playlistId, int albumId)
        {
            var albumSongs = await _context.AlbumSongs
                .Where(asg => asg.AlbumId == albumId)
                .Select(asg => asg.SongId)
                .ToListAsync();

            var playlistSongs = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId && albumSongs.Contains(ps.SongId))
                .ToListAsync();

            if (playlistSongs.Any())
            {
                _context.PlaylistSongs.RemoveRange(playlistSongs);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Albums>> GetAlbumsFromPlaylist(int playlistId)
        {
            var songIds = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == playlistId)
                .Select(ps => ps.SongId)
                .ToListAsync();

            var albumIds = await _context.AlbumSongs
                .Where(asg => songIds.Contains(asg.SongId))
                .Select(asg => asg.AlbumId)
                .Distinct()
                .ToListAsync();

            return await _context.Albums
                .Where(a => albumIds.Contains(a.Id))
                .ToListAsync();
        }
    }
}
