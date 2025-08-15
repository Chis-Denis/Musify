namespace Domain.Entities;

public class Artists
{
    public int Id { get; set; }

    public string? StageName { get; set; }
    public string? BandName { get; set; }

    public DateTime? Birthday { get; set; }
    public string? Location { get; set; }

    public DateTime? ActiveStart { get; set; }
    public DateTime? ActiveEnd { get; set; }

    public string Type { get; set; } = null!; // "person" or "band"

    public string? FirstName { get; set; } // for "person"
    public string? LastName { get; set; }  // for "person"

    public ICollection<SongArtists> SongArtists { get; set; } = new List<SongArtists>();
    public ICollection<Albums> Albums { get; set; } = new List<Albums>();

    public ICollection<Artists> Members { get; set; } = new List<Artists>(); // person
    public ICollection<Artists> Bands { get; set; } = new List<Artists>();     // band
}
