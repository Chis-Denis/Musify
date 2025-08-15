using Domain.Entities;
using Musify.DTOs.AlbumDTOs;
using Musify.DTOs.AlbumSongsDTOs;

namespace Musify.Mapping
{
    public static class AlbumMappingExtensions
    {
        // Albums mapping
        public static AlbumResponseDTO ToDTO(this Albums album) => new()
        {
            Id = album.Id,
            Title = album.Title,
            Description = album.Description,
            ArtistId = album.ArtistId,
            Genre = album.Genre,
            ReleaseDate = album.ReleaseDate,
            Label = album.Label,
        };

        public static Albums ToEntity(this AlbumRequestDTO albumRequestDTO) => new()
        {
            Title = albumRequestDTO.Title,
            Description = albumRequestDTO.Description,
            ArtistId = albumRequestDTO.ArtistId,
            Genre = albumRequestDTO.Genre,
            ReleaseDate = albumRequestDTO.ReleaseDate,
            Label = albumRequestDTO.Label,
        };

        public static Albums ToEntity(this AlbumDTO albumDTO) => new()
        {
            Id = albumDTO.Id,
            Title = albumDTO.Title,
            Description = albumDTO.Description,
            ArtistId = albumDTO.ArtistId,
            Genre = albumDTO.Genre,
            ReleaseDate = albumDTO.ReleaseDate,
            Label = albumDTO.Label,
        };

        // AlbumSongs mapping
        public static AlbumSongs ToEntity(this AlbumSongsDTO albumSongsDTO) => new()
        {
            AlbumId = albumSongsDTO.AlbumId,
            SongId = albumSongsDTO.SongId,
            Position = albumSongsDTO.Position,
        };
    }
}
