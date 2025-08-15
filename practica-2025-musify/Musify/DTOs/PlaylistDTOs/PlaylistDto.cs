namespace Musify.DTOs.PlaylistDTOs
{
    public class PlaylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int UserId { get; set; }
        public string Type { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
