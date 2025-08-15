namespace Musify.DTOs.PlaylistDTOs
{
    public class CreatePlaylistDto
    {
        public string Name { get; set;  } = null!;
        public int UserId { get; set; }
        public string Type { get; set; } = null!;
    }
}
