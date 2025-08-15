namespace Domain.Entities
{
    public class SongArtists
    {

        public int Id { get; set; }
        public int SongId { get; set; }
        public Songs Song { get; set; } = null!;

        public int ArtistId { get; set; }
        public Artists Artist { get; set; } = null!;
    }
}
