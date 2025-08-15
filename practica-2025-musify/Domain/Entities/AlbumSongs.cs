namespace Domain.Entities
{
    public class AlbumSongs
    {
        public int Id { get; set; }

        public int AlbumId { get; set; }
        public Albums Album { get; set; } = null!;

        public int SongId { get; set; }
        public Songs Song { get; set; } = null!;

        public int? Position { get; set; }
    }
}
