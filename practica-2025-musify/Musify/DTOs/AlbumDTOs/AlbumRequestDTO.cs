namespace Musify.DTOs.AlbumDTOs
{
    public class AlbumRequestDTO
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? ArtistId { get; set; }
        public string? Genre { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? Label { get; set; }
    }
}
