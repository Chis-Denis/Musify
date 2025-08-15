namespace Musify.DTOs.ArtistDTOs
{
    public class ArtistDto
    {
        public string? StageName { get; set; }
        public string? BandName { get; set; }
        public string? Location { get; set; }
        public DateTime? Birthday { get; set; }
        public DateTime? ActiveStart { get; set; }
        public DateTime? ActiveEnd { get; set; }
        public string Type { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 
    }
}
