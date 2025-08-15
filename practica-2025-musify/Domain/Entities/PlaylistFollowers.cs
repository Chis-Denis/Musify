namespace Domain.Entities;

public class PlaylistFollowers
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public Users User { get; set; } = null!;

    public int PlaylistId { get; set; }
    public Playlists Playlist { get; set; } = null!;
}
