namespace Musify.Mappings
{
    using Domain.Entities;
    using Musify.DTOs.PlaylistDTOs;

    public static class PlaylistMappingExtensions
    {
        public static PlaylistDto ToDto(this Playlists playlist)
        {
            return new PlaylistDto
            {
                Id = playlist.Id,
                Name = playlist.Name!,
                UserId = playlist.UserId,
                Type = playlist.Type,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt
            };
        }
        public static Playlists ToEntity(this PlaylistDto dto)
        {
            return new Playlists
            {
                Id = dto.Id,
                Name = dto.Name,
                UserId = dto.UserId,
                Type = dto.Type,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt
            };
        }
    }
}