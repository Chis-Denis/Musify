namespace Musify.DTOs.SongDTOs
{
    public class BriefSongCreationDTO
    {
        public string Title { get; set; } = null!;
        public DateTime? CreationDate { get; set; }
        public List<int>? ArtistIds { get; set; }
    }

}
