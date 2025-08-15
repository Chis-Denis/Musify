using Application.Contracts;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;

namespace Application.UseCases
{
    public class ArtistService:IArtistService
    {
        private readonly IArtistRepository _repo;

        public ArtistService(IArtistRepository repo)
        {
            _repo = repo;
        }

        private Artists SimplifyArtistRelations(Artists artist)
        {
            if (artist == null)
                return null!;

            var simpleMembers = artist.Members?.Select(m => new Artists
            {
                Id = m.Id,
                StageName = m.StageName,
                BandName = m.BandName,
                Type = m.Type,
                Birthday = m.Birthday,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ActiveStart = m.ActiveStart,
                ActiveEnd = m.ActiveEnd,
                Location = m.Location
            }).ToList();

            var simpleBands = artist.Bands?.Select(b => new Artists
            {
                Id = b.Id,
                StageName = b.StageName,
                BandName = b.BandName,
                Type = b.Type,
                Birthday = b.Birthday,
                FirstName = b.FirstName,
                LastName = b.LastName,
                ActiveStart = b.ActiveStart,
                ActiveEnd = b.ActiveEnd,
                Location = b.Location
            }).ToList();


            var simpleAlbums = artist.Albums?.Select(a => new Albums
            {
                Id = a.Id,
                Title = a.Title,
                Genre = a.Genre,
                Label = a.Label,
                Description = a.Description,
                ReleaseDate = a.ReleaseDate
            }).ToList();


            var simpleSongs = artist.SongArtists?.Select(sa => new SongArtists
            {
                SongId = sa.SongId,
                ArtistId = sa.ArtistId,
                Song = sa.Song == null ? null : new Songs
                {
                    Id = sa.Song.Id,
                    Title = sa.Song.Title,
                    Duration = sa.Song.Duration,
                    CreationDate = sa.Song.CreationDate
                }
            }).ToList();

            artist.Members = simpleMembers ?? new List<Artists>();
            artist.Bands = simpleBands ?? new List<Artists>();
            artist.Albums = simpleAlbums ?? new List<Albums>();
            artist.SongArtists = simpleSongs ?? new List<SongArtists>();

            return artist;
        }



        public async Task<IEnumerable<Artists>> GetAll(string? type = null)
        {
            IEnumerable<Artists> artists;

            if (!string.IsNullOrWhiteSpace(type) && type.ToLower() == ArtistEnum.band.ToString())
                artists = await _repo.GetAllBands();
            else if (!string.IsNullOrWhiteSpace(type) && type.ToLower() == ArtistEnum.person.ToString())
                artists = await _repo.GetAllArtists();
            else
                artists = await _repo.GetAll();

            return artists.Select(a => SimplifyArtistRelations(a));
        }

        public async Task<IEnumerable<Artists>> GetAll()
        {
            var artists = await _repo.GetAll();
            return artists.Select(a => SimplifyArtistRelations(a));
        }

        public async Task<IEnumerable<Artists>> GetAllArtists()
        {
            var artists = await _repo.GetAllArtists();
            return artists.Select(a => SimplifyArtistRelations(a));
        }

        public async Task<Artists?> GetArtistById(int id)
        {
            var artist = await _repo.GetArtistById(id);

            if (artist == null) {
                throw new BusinessException("Artist not found");
            }

            return SimplifyArtistRelations(artist);
        }

        public async Task<Artists?> GetArtist(int id)
        {
            var artist = await _repo.GetArtistById(id);

            if (artist == null)
            {
                throw new BusinessException("Artist not found");
            }

            return artist;
        }

        public async Task AddArtist(Artists artist)
        {
            if (artist == null) 
            {
                throw new BusinessException("Artist is null");
            }
            await _repo.AddArtist(artist);
        }

        public async Task UpdateArtist(Artists artist)
        {
            var existingArtist = await _repo.GetArtistById(artist.Id);

            if (existingArtist == null)
            {
                throw new BusinessException("Artist is null");
            }

            if (existingArtist.Type != artist.Type) {
                throw new BusinessException("Artist found doesn't match type");
            }

            existingArtist.ActiveStart = artist.ActiveStart;
            existingArtist.ActiveEnd = artist.ActiveEnd;

            if (existingArtist.Type == ArtistEnum.person.ToString())
            {
                existingArtist.StageName = artist.StageName;
            }
            else {
                existingArtist.BandName = artist.BandName;
                existingArtist.Location = artist.Location;
            }

            await _repo.UpdateArtist(existingArtist);
        }

        public async Task DeleteArtist(Artists artist)
        {
            if (artist == null)
            {
                throw new BusinessException("Artist is null");
            }

           await _repo.DeleteArtist(artist);
        }

        public Task<IEnumerable<Artists>> GetAllBands()
        {
            return _repo.GetAllBands();
        }

        public async Task AddBandMember(Artists band, Artists member)
        {
            if (band == null || member == null) 
            {
                throw new BusinessException("Artist-person or Artist-band is null");
            }
            await _repo.AddBandMember(band, member);
        }

        public async Task RemoveBandMember(Artists band, Artists member)
        {
            if (band == null || member == null)
            {
                throw new BusinessException("Artist-person or Artist-band is null");
            }
            await _repo.RemoveBandMember(band, member);
        }

        public async Task<IEnumerable<Artists>> Search(string name) 
        {
            var artists = await _repo.Search(name);
            return artists.Select(a => SimplifyArtistRelations(a));
        }

    }
}
