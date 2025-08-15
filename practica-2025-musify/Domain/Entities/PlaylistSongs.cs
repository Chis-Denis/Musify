namespace Domain.Entities
{
    public class PlaylistSongs
    {
        public int Id { get; set; }

        public int PlaylistId { get; set; }
        public Playlists Playlist { get; set; } = null!;

        public int SongId { get; set; }
        public Songs Song { get; set; } = null!;

        public int? Position { get; set; }
    }

}
