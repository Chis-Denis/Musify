using Musify.DTOs.SongDTOs;

namespace Musify.Validations
{
    public class SongValidation
    {
        public static Dictionary<string, string> ValidateSongCreate(BriefSongCreationDTO dto)
        {
            var errors = new Dictionary<string, string>();
            if (dto == null)
            {
                errors.Add("dto", "Song data is required.");
                return errors;
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
                errors.Add("Title", "Title is required.");


            if (dto.CreationDate.HasValue && dto.CreationDate.Value > DateTime.UtcNow)
                errors.Add("CreationDate", "Creation date cannot be in the future.");

            return errors;
        }

        public static Dictionary<string, string> ValidateSongUpdate(BriefSongUpdateDTO dto)
        {
            var errors = new Dictionary<string, string>();
            if (dto == null)
            {
                errors.Add("dto", "Song data is required.");
                return errors;
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
                errors.Add("Title", "Title is required.");

            return errors;
        }

        public static Dictionary<string, string> ValidateAlternativeTitles(AlternativeTitlesSongDTO dto)
        {
            var errors = new Dictionary<string, string>();
            if (dto == null)
            {
                errors.Add("dto", "Alternative titles data is required.");
                return errors;
            }

            if (dto.Title == null || dto.Language == null)
            {
                errors.Add("dto", "Titles and Languages lists are required.");
                return errors;
            }

            if (dto.Title.Count != dto.Language.Count)
                errors.Add("ListLength", "Titles and Languages must have the same length.");

            for (int i = 0; i < dto.Title.Count; i++)
            {
                if (string.IsNullOrWhiteSpace(dto.Title[i]))
                    errors.Add($"Title[{i}]", "Alternative title is required.");

            }

            return errors;
        }

        public static Dictionary<string, string> ValidateSongSearch(string name)
        {
            var errors = new Dictionary<string, string>();
            if (string.IsNullOrWhiteSpace(name))
                errors.Add("name", "Song name is required.");
            return errors;
        }

        public static Dictionary<string, string> ValidateSongId(int id)
        {
            var errors = new Dictionary<string, string>();
            if (id < 0)
                errors.Add("id","id must be positive");
            return errors;
        }
    }
}
