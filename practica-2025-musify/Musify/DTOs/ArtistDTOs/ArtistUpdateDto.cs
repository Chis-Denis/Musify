namespace Musify.DTOs.ArtistDTOs
{
    public class ArtistUpdateDto
    {
        public int Id { get; set; }
        public string? StageName { get; set; }
        public string? BandName { get; set; }
        public string? Location { get; set; }
        public DateTime? ActiveStart { get; set; }
        public DateTime? ActiveEnd { get; set; }
        public string Type { get; set; } = null!;
    }
}
