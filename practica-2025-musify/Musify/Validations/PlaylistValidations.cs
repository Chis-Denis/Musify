using Musify.DTOs.PlaylistDTOs;

namespace Musify.Validations
{
    public static class PlaylistValidations
    {
        public static List<string> ValidatePlaylistCreate(CreatePlaylistDto dto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(dto.Name))
                errors.Add("Name is required.");

            if (string.IsNullOrWhiteSpace(dto.Type))
                errors.Add("Type is required.");
            else if (dto.Type != "private" && dto.Type != "public")
                errors.Add("Type must be either 'private' or 'public'.");

            if (dto.UserId <= 0)
                errors.Add("Valid UserId is required.");

            return errors;
        }
        public static List<string> ValidatePlaylistUpdateName(string newName)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(newName))
                errors.Add("New name is required.");
            else if (newName.Length < 3 || newName.Length > 100)
                errors.Add("New name must be between 3 and 100 characters.");

            return errors;
        }

        public static List<string> ValidatePlaylistId(int id)
        {
            var errors = new List<string>();

            if (id <= 0)
                errors.Add("Id must be greater than zero.");

            return errors;
        }

        public static List<string> ValidateAddSongToPlaylist(int playlistId, int songId)
        {
            var errors = new List<string>();

            if (playlistId <= 0)
                errors.Add("PlaylistId must be greater than zero.");

            if (songId <= 0)
                errors.Add("SongId must be greater than zero.");

            return errors;
        }
    }
}