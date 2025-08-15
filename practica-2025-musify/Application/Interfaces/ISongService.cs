using Domain.Entities;

namespace Application.Interfaces
{
    public interface ISongService
    {
        Task<IEnumerable<Songs>> GetAllSongs();

        Task<Songs?> GetSongById(int id);

        Task<Songs> CreateSong(Songs song);
        Task UpdateSong(Songs song);

        Task DeleteSong(int id);

        Task<IEnumerable<Songs>> SearchSongsByName(string name);
        Task<IEnumerable<Songs>> GetTrendingSongs();
        Task AddAlternativeTitles(int id, List<SongAlternativeTitles> alternatives);
        Task<IEnumerable<Songs>> GetAllArtistSongs(int artistId);
    }
}
