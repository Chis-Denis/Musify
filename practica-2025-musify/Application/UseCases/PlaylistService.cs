using Application.Exceptions;
using Application.Interfaces;
using Application.Contracts;
using Domain.Entities;

namespace Application.UseCases
{
    public class PlaylistService : IPlaylistService
    {
        private readonly IPlaylistRepository _repo;

        public PlaylistService(IPlaylistRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Playlists>> GetAllPlaylists()
        {
            var playlists = await _repo.GetAllPlaylists();

            return playlists ?? Enumerable.Empty<Playlists>();
        }

        public async Task<Playlists> GetPlaylistById(int playlistId)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);
            if (playlist == null)
            {
                throw new BusinessException("Playlist not found");
            }
            return playlist;
        }

        public async Task<Playlists> CreatePlaylist(string name, int userId, string type)
        {
            var newPlaylist = new Playlists
            {
                Name = name,
                UserId = userId,
                Type = type.ToLower() == "public" ? "public" : "private",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repo.CreatePlaylist(newPlaylist);
            return newPlaylist;
        }

        public async Task UpdatePlaylistName(int playlistId, string newName)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);
            if (playlist == null)
                throw new BusinessException("Playlist not found.");

            playlist.Name = newName;
            playlist.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdatePlaylist(playlist);
        }

        public async Task DeletePlaylist(int playlistId)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);
            if (playlist == null)
                throw new BusinessException("Playlist not found.");

            await _repo.DeletePlaylist(playlistId);
        }

        public async Task<IEnumerable<Playlists>> GetPrivatePlaylists()
        {
            var privatePlaylists = await _repo.GetPrivatePlaylists();
            return privatePlaylists ?? Enumerable.Empty<Playlists>();
        }

        public async Task<IEnumerable<Playlists>> GetPublicPlaylists()
        {
            var publicPlaylists = await _repo.GetPublicPlaylists();
            return publicPlaylists ?? Enumerable.Empty<Playlists>();
        }

        public async Task<IEnumerable<PlaylistSongs>> GetSongsInPlaylist(int playlistId)
        {
            return await _repo.GetSongsInPlaylist(playlistId);
        }

        public async Task AddSongToPlaylist(int playlistId, int songId)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);
            if (playlist == null)
                throw new BusinessException("Playlist not found.");

            var songsInPlaylist = await _repo.GetSongsInPlaylist(playlistId);
            if (songsInPlaylist.Any(ps => ps.SongId == songId))
                throw new BusinessException("Song already exists in playlist.");

            await _repo.AddSongToPlaylist(playlistId, songId);
        }

        public async Task RemoveSongFromPlaylist(int playlistId, int songId)
        {
            await _repo.RemoveSongFromPlaylist(playlistId, songId);
            var songs = await _repo.GetSongsInPlaylist(playlistId);
            int pos = 1;
            foreach (var s in songs.OrderBy(ps => ps.Position))
            {
                s.Position = pos++;
            }

            await _repo.UpdatePlaylistSongsOrder(songs);
        }

        public async Task<bool> PlaylistExists(int playlistId)
        {
            return await _repo.PlaylistExists(playlistId);
        }

        public async Task<IEnumerable<Playlists>> GetFollowedPlaylists(int userId)
        {
            return await _repo.GetFollowedPlaylists(userId);
        }

        public async Task UpdatePlaylistSongsOrder(int playlistId, List<int> songIdsInOrder)
        {
            var songs = await _repo.GetSongsInPlaylist(playlistId);
            var songIdsInDb = songs.Select(s => s.SongId).ToList();
            if (!songIdsInDb.All(songIdsInOrder.Contains) || songIdsInDb.Count != songIdsInOrder.Count)
            {
                throw new BusinessException("Provided song IDs do not match playlist songs.");
            }
            int position = 1;
            foreach (var songId in songIdsInOrder)
            {
                var song = songs.First(s => s.SongId == songId);
                song.Position = position++;
            }

            await _repo.UpdatePlaylistSongsOrder(songs);
        }
        public async Task<bool> IsUserFollowingPlaylist(int playlistId, int userId)
        {
            return await _repo.IsUserFollowingPlaylist(playlistId, userId);
        }
        public async Task FollowPublicPlaylist(int playlistId, int userId)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);

            if (playlist == null)
            {
                throw new BusinessException("Playlist does not exist");
            }

            if (!playlist.Type.Equals("public", StringComparison.OrdinalIgnoreCase))
            {
                throw new BusinessException("Playlist exists but is not public");
            }

            var isFollowing = await _repo.IsUserFollowingPlaylist(playlistId, userId);
            if (isFollowing)
            {
                throw new BusinessException("You are already following this playlist");
            }

            await _repo.FollowPublicPlaylist(playlistId, userId);
        }


        public async Task UnfollowPublicPlaylist(int playlistId, int userId)
        {
            var playlist = await _repo.GetPlaylistById(playlistId);

            if (playlist == null)
            {
                throw new BusinessException("Playlist does not exist");
            }

            if (!playlist.Type.Equals("public", StringComparison.OrdinalIgnoreCase))
            {
                throw new BusinessException("Playlist exists but is not public");
            }

            await _repo.UnfollowPublicPlaylist(playlistId, userId);
        }

        public async Task AddAlbumToPlaylist(int playlistId, int albumId)
        {
            if (!await _repo.PlaylistExists(playlistId))
                throw new BusinessException("Playlist does not exist.");

            if (!await _repo.AlbumExists(albumId))
                throw new BusinessException("Album does not exist.");

            var album = await _repo.GetAlbumWithSongs(albumId);
            if (album == null || album.AlbumSongs == null || !album.AlbumSongs.Any())
                throw new BusinessException("Album has no songs.");

            await _repo.AddAlbumSongsToPlaylist(playlistId, albumId);
            await _repo.SaveChanges();
        }

        public async Task RemoveAlbumFromPlaylist(int playlistId, int albumId)
        {
            await _repo.RemoveAlbumFromPlaylist(playlistId, albumId);
        }

        public async Task<IEnumerable<Albums>> GetAlbumsFromPlaylist(int playlistId)
        {
            return await _repo.GetAlbumsFromPlaylist(playlistId);
        }

        public async Task<IEnumerable<Playlists>> SearchPlaylistsByName(string name)
        {
            return await _repo.SearchPlaylistsByName(name);
        }
    }
}
