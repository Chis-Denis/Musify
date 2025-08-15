using Domain.Entities;

namespace Application.Contracts
{
    public interface IArtistRepository
    {
        Task<IEnumerable<Artists>> GetAllArtists();
        Task<Artists?> GetArtistById(int id);
        Task<IEnumerable<Artists>> Search(string name);
        Task AddArtist(Artists artist);
        Task UpdateArtist(Artists artist);
        Task DeleteArtist(Artists artist);
        Task<IEnumerable<Artists>> GetAllBands();
        public Task<IEnumerable<Artists>> GetAll();
        Task AddBandMember(Artists band, Artists member);
        Task RemoveBandMember(Artists band, Artists member);
    }
}
