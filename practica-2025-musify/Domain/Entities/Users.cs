namespace Domain.Entities;

public class Users
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Country { get; set; }
    public string Role { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public string Token { get; set; }

    public ICollection<Playlists> Playlists { get; set; } = new List<Playlists>();
    public ICollection<PlaylistFollowers> PlaylistFollowers { get; set; } = new List<PlaylistFollowers>();
}
