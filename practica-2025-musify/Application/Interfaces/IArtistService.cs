using Domain.Entities;

namespace Application.Interfaces
{
    public interface IArtistService
    {
        Task<IEnumerable<Artists>> GetAllArtists();
        Task<IEnumerable<Artists>> GetAllBands();
        Task<Artists?> GetArtistById(int id);
        Task<Artists?> GetArtist(int id);
        Task<IEnumerable<Artists>> Search(string name);
        Task AddArtist(Artists dto);
        Task UpdateArtist(Artists dto);
        Task DeleteArtist(Artists artist);
        Task<IEnumerable<Artists>> GetAll(string? type = null);
        Task AddBandMember(Artists band, Artists member);
        Task RemoveBandMember(Artists band, Artists member);
    }
}
