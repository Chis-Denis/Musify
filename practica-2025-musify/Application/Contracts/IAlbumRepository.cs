using Domain.Entities;

namespace Application.Contracts
{
    public interface IAlbumRepository
    {
        Task<IEnumerable<Albums>> GetAllAlbums();
        Task<IEnumerable<Albums>> GetAllArtistAlbums(int artistId);
        Task<IEnumerable<Songs>> GetAllAlbumSongs(int id);
        Task CreateAlbums(Albums album);
        Task UpdateAlbums(Albums updatedAlbum);
        Task<IEnumerable<Albums>> SearchAlbums(string searchQuery);
        Task<Albums?> GetAlbumsById(int id);
        Task DeleteAlbums(int id);
        Task AddSongToAlbum(AlbumSongs albumSong);
        Task DeleteAlbumSong(int albumId,int songId);
        Task<int?> GetAlbumSongPosition(int albumId, int songId);
        Task<bool> CheckAlbumPosition(int albumId, int position);
        Task UpdateAlbumSong(AlbumSongs albumSong);
        Task<IEnumerable<Albums>> SearchAlbumsByGenre(string searchQuery);
    }
}
