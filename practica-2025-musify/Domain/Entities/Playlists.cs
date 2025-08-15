namespace Domain.Entities;

public class Playlists
{
    public int Id { get; set; }

    public string? Name { get; set; }
    public int UserId { get; set; }
    public Users User { get; set; } = null!;

    public string Type { get; set; } = null!; // "private" or "public"
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<PlaylistSongs> PlaylistSongs { get; set; } = new List<PlaylistSongs>();
    public ICollection<PlaylistFollowers> PlaylistFollowers { get; set; } = new List<PlaylistFollowers>();
}
