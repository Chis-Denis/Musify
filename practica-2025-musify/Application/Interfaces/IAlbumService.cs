using Domain.Entities;

public interface IAlbumService
{
    Task CreateAlbum(Albums album);
    Task<Albums?> GetAlbumsById(int id);
    Task<IEnumerable<Albums>> GetAllAlbums();
    Task<IEnumerable<Albums>> GetAllArtistAlbums(int artistId);
    Task<IEnumerable<Albums>> SearchAlbums(string searchQuery);
    Task UpdateAlbums(Albums album);
    Task DeleteAlbums(int id);
    Task<IEnumerable<Songs>> GetAllAlbumSongs(int id);
    Task AddSongToAlbum(AlbumSongs albumSongs);
    Task DeleteAlbumSong(int albumId, int songId);
    Task<int?> GetAlbumSongPosition(int albumId, int songId);
    Task<bool> CheckAlbumPosition(int albumId, int position);
    Task UpdateAlbumSong(AlbumSongs albumSongs);
    Task<IEnumerable<Albums>> SearchAlbumsByGenre(string searchQuery);
}
