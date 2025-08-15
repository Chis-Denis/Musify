using Domain.Entities;

namespace Application.Interfaces
{
    public interface IPlaylistService
    {
        Task<bool> PlaylistExists(int playlistId);

        Task<IEnumerable<Playlists>> GetAllPlaylists();
        Task<Playlists?> GetPlaylistById(int playlistId);
        Task<Playlists> CreatePlaylist(string name, int userId, string type);
        Task UpdatePlaylistName(int playlistId, string newName);
        Task DeletePlaylist(int playlistId);

        Task<IEnumerable<PlaylistSongs>> GetSongsInPlaylist(int playlistId);
        Task<IEnumerable<Playlists>> GetPrivatePlaylists();
        Task<IEnumerable<Playlists>> GetPublicPlaylists();
        Task AddSongToPlaylist(int playlistId, int songId);
        Task RemoveSongFromPlaylist(int playlistId, int songId);
        Task AddAlbumToPlaylist(int playlistId, int albumId);
        Task RemoveAlbumFromPlaylist(int playlistId, int albumId);
        Task<IEnumerable<Albums>> GetAlbumsFromPlaylist(int playlistId);

        Task<IEnumerable<Playlists>> GetFollowedPlaylists(int userId);
        Task UpdatePlaylistSongsOrder(int playlistId, List<int> songIdsInOrder);
        Task FollowPublicPlaylist(int playlistId, int userId);
        Task UnfollowPublicPlaylist(int playlistId, int userId);
        Task<IEnumerable<Playlists>> SearchPlaylistsByName(string name);
        Task<bool> IsUserFollowingPlaylist(int playlistId, int userId);
    }
}
