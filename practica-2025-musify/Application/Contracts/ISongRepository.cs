using Domain.Entities;

namespace Application.Contracts
{
    public interface ISongRepository
    {
        Task<IEnumerable<Songs>> GetAllSongs();
        Task<Songs?> GetSongById(int id);
        Task<Songs?> GetSongByIdWithArtists(int id);
        Task<Songs> AddSong(Songs song);
        Task UpdateSong(Songs song);
        Task DeleteSong(Songs song);
        Task<IEnumerable<Songs>> SearchSongsByName(string name);
        Task<IEnumerable<Songs>> GetTrendingSongs();

        Task<Songs?> GetByIdWithAlternatives(int id);
        Task SaveChanges();
        Task<IEnumerable<Songs>> GetAllArtistSongs(int artistId);
        Task RemoveSongArtists(IEnumerable<SongArtists> songArtists);
    }
}
