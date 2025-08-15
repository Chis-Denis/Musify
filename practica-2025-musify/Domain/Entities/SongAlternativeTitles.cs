namespace Domain.Entities
{
    public class SongAlternativeTitles
    {
        public int Id { get; set; }

        public int SongId { get; set; }
        public Songs Song { get; set; } = null!;

        public string? AlternativeTitle { get; set; }
        public string? Language { get; set; }
    }

}
