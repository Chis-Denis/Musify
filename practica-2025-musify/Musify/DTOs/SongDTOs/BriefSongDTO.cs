namespace Musify.DTOs.SongDTOs
{
    public class BriefSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;

        public List<String>? ArtistsStageName{ get; set; }

        public TimeSpan? Duration { get; set; }
        public DateTime? CreationDate { get; set; }

        public List<int>? ArtistIds { get; set; }

    }
}
