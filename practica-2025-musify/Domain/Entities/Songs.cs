namespace Domain.Entities
{
    public class Songs
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public TimeSpan? Duration { get; set; }
        public DateTime? CreationDate { get; set; }

        // Relationships
        public ICollection<SongArtists> SongArtists { get; set; } = new List<SongArtists>();
        public ICollection<SongAlternativeTitles> AlternativeTitles { get; set; } = new List<SongAlternativeTitles>();
        public ICollection<AlbumSongs> AlbumSongs { get; set; } = new List<AlbumSongs>();
        public ICollection<PlaylistSongs> PlaylistSongs { get; set; } = new List<PlaylistSongs>();
    }

}
