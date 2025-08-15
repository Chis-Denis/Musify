using Musify.DTOs.AlbumDTOs;
using Musify.DTOs.AlbumSongsDTOs;

namespace Musify.Validations
{
    public class AlbumControllerValidator
    {
        public AlbumControllerValidator()
        {
        }
        public async Task<Dictionary<string, string>> ValidateCreateAlbum(AlbumRequestDTO albumRequestDTO)
        {
            var errors = new Dictionary<string, string>();

            if (string.IsNullOrEmpty(albumRequestDTO.Title))
            {
                errors.Add("Title", "Title should not be empty!");
            }
            if (string.IsNullOrEmpty(albumRequestDTO.Genre))
            {
                errors.Add("Genre", "Genre should not be empty!");
            }
            if (string.IsNullOrEmpty(albumRequestDTO.Label))
            {
                errors.Add("Label", "Label should not be empty!");
            }
            if (albumRequestDTO.ReleaseDate == null)
            {
                errors.Add("Release Date Empty", "Release date should not be empty!");
            }
            if (albumRequestDTO.ReleaseDate > DateTime.UtcNow)
            {
                errors.Add("Release Date", "Release date should not be in the future!");
            }
            if (!albumRequestDTO.ArtistId.HasValue || albumRequestDTO.ArtistId <= 0)
            {
                errors.Add("Artist ID", "Artist ID should not be less than 1  and should not be null!");
            }
            return errors;
        }

        public async Task<Dictionary<string, string>> ValidateUpdateAlbum(AlbumDTO albumDTO)
        {
            var errors = new Dictionary<string, string>();

            if(albumDTO.Id <= 0)
            {
                errors.Add("Album ID", "Album ID should not be less than 1!");
            }
            if (string.IsNullOrEmpty(albumDTO.Title))
            {
                errors.Add("Title", "Title should not be empty!");
            }
            if (string.IsNullOrEmpty(albumDTO.Genre))
            {
                errors.Add("Genre", "Genre should not be empty!");
            }
            if (string.IsNullOrEmpty(albumDTO.Label))
            {
                errors.Add("Label", "Label should not be empty!");
            }
            if (albumDTO.ReleaseDate == null)
            {
                errors.Add("Release Date Empty", "Release date should not be empty!");
            }
            if (albumDTO.ReleaseDate > DateTime.UtcNow)
            {
                errors.Add("Release Date", "Release date should not be in the future!");
            }
            if (!albumDTO.ArtistId.HasValue || albumDTO.ArtistId <= 0)
            {
                errors.Add("Artist ID", "Artist ID should not be less than 1 and should not be null!");
            }
            return errors;
        }

        public async Task< Dictionary<string, string>> ValidateAddAlbumSongs(AlbumSongsDTO albumSongsDTO)
        {
            var errors = new Dictionary<string, string>();
            if (albumSongsDTO.Position < 1)
            {
                errors.Add("Position", "Position should not be less than 1!");
            }
            return errors;
        }

        public async Task<Dictionary<string, string>> ValidateUpdateAlbumSongs(AlbumSongsDTO albumSongsDTO)
        {
            var errors = new Dictionary<string, string>();
            if (albumSongsDTO.Position < 1)
            {
                errors.Add("Position", "Position should not be less than 1!");
            }
            return errors;
        }
    }
}
