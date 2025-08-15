namespace Musify.DTOs.SongDTOs
{
    public class BriefSongUpdateDTO
    {
        public string Title { get; set; } = null!;
        public List<int>? ArtistIds { get; set; }
    }

}
