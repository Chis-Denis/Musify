namespace Musify.DTOs.SongDTOs
{
    public class SongWithAlternativeTitlesDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public TimeSpan? Duration { get; set; }
        public DateTime? CreationDate { get; set; }

        public List<String>? ArtistsStageName { get; set; }
        public List<int>? SongsId { get; set; }

        public List<AlternativeTitleDTO>? AlternativeTitles { get; set; }
    }

    public class AlternativeTitleDTO
    {
        public string Title { get; set; } = null!;
        public string? Language { get; set; }
    }
}
