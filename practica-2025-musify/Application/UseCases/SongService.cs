using Application.Contracts;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;

namespace Application.UseCases
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;

        public SongService(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        public async Task<IEnumerable<Songs>> GetAllSongs()
        {
            return await _songRepository.GetAllSongs();
        }

        public async Task<Songs?> GetSongById(int id)
        { 
            var song = await _songRepository.GetSongByIdWithArtists(id);
            if (song == null) 
                throw new BusinessException("Song not found");
            return song;
        }

        public async Task<Songs> CreateSong(Songs song)
        {
            await _songRepository.AddSong(song);
            return song;
        }

        public async Task UpdateSong(Songs songModified)
        {
            var existing = await _songRepository.GetSongByIdWithArtists(songModified.Id)
                ?? throw new BusinessException("Song not found");

            existing.Title = songModified.Title;

            var toRemove = existing.SongArtists.Where(sa => sa.Id > 0).ToList();

            await _songRepository.RemoveSongArtists(toRemove);
        }

        public async Task DeleteSong(int id)
        {
            var song = await _songRepository.GetSongById(id) 
                ?? throw new BusinessException($"Deletion could not be performed because song with id {id} does not exist");
            await _songRepository.DeleteSong(song);
        }

        public async Task<IEnumerable<Songs>> SearchSongsByName(string name)
        {
            return await _songRepository.SearchSongsByName(name);
        }


        public async Task<IEnumerable<Songs>> GetTrendingSongs()
        {
            return await _songRepository.GetTrendingSongs();
        }

        public async Task AddAlternativeTitles(int id, List<SongAlternativeTitles> alternatives)
        {
            if (alternatives == null)
                throw new BusinessException($"{nameof(alternatives)} is null");

            var song = await _songRepository.GetByIdWithAlternatives(id)
                       ?? throw new BusinessException($"Song with {id} not found");

            foreach (var alt in alternatives)
            {
                alt.SongId = id;
                alt.Song = null!;
                bool exists = song.AlternativeTitles
                    .Any(e =>
                        e.AlternativeTitle == alt.AlternativeTitle &&
                        e.Language == alt.Language
                    );
                if (exists)
                    continue;

                song.AlternativeTitles.Add(alt);
            }

            await _songRepository.SaveChanges();
        }

        public async Task<IEnumerable<Songs>> GetAllArtistSongs(int artistId)
        {
            return await _songRepository.GetAllArtistSongs(artistId);
        }
    }
}
