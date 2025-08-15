using Domain.Entities;

namespace Application.Contracts
{
    public interface IPlaylistRepository
    {
        Task<IEnumerable<Playlists>> GetAllPlaylists();
        Task<Playlists?> GetPlaylistById(int playlistId);
        Task CreatePlaylist(Playlists playlist);
        Task UpdatePlaylist(Playlists playlist);
        Task DeletePlaylist(int playlistId);

        Task<IEnumerable<PlaylistSongs>> GetSongsInPlaylist(int playlistId);
        Task AddSongToPlaylist(int playlistId, int songId);
        Task RemoveSongFromPlaylist(int playlistId, int songId);
        Task<bool> AlbumExists(int albumId);
        Task<Albums?> GetAlbumWithSongs(int albumId);
        Task AddAlbumSongsToPlaylist(int playlistId, int albumId);
        Task RemoveAlbumFromPlaylist(int playlistId, int albumId);
        Task<IEnumerable<Albums>> GetAlbumsFromPlaylist(int playlistId);

        Task<IEnumerable<Playlists>> GetPrivatePlaylists();
        Task<IEnumerable<Playlists>> GetPublicPlaylists();
        Task<bool> PlaylistExists(int playlistId);
        Task<IEnumerable<Playlists>> GetFollowedPlaylists(int userId);
        Task UpdatePlaylistSongsOrder(IEnumerable<PlaylistSongs> songs);
        Task FollowPublicPlaylist(int playlistId, int userId);
        Task UnfollowPublicPlaylist(int playlistId, int userId);
        Task SaveChanges();
        Task<IEnumerable<Playlists>> SearchPlaylistsByName(string name);
        Task<bool> IsUserFollowingPlaylist(int playlistId, int userId);
    }
}
