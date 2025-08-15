using Domain.Entities;
using Musify.DTOs.SongDTOs;

namespace Musify.Mapping
{
    public static class SongMappingExtensions
    {
        public static void ToDto(this Songs src, BriefSongDTO dto)
        {
            dto.Id = src.Id;
            dto.Title = src.Title;
            dto.Duration = src.Duration;
            dto.CreationDate = src.CreationDate;

            dto.ArtistIds = src.SongArtists
                .Select(sa => sa.Artist?.Id ?? 0)
                .ToList();
            dto.ArtistsStageName = src.SongArtists?
                .Select(sa => sa.Artist?.StageName ?? "Unknown Artist")
                .ToList()
                ?? new List<string>();
        }
        public static void ToDto(this Songs src, SongWithAlternativeTitlesDTO dto)
        {
            dto.Id = src.Id;
            dto.Title = src.Title;
            dto.Duration = src.Duration;
            dto.CreationDate = src.CreationDate;
            dto.AlternativeTitles = src.AlternativeTitles?
                           .Select(at => at.ToDto())
                           .ToList();

            dto.ArtistsStageName = src.SongArtists?
                .Select(sa => sa.Artist?.StageName ?? "Unknown Artist")
                .ToList()
                ?? new List<string>();
        }


        public static AlternativeTitleDTO ToDto(this SongAlternativeTitles src) => new()
        { 
            Title = src.AlternativeTitle!,
            Language = src.Language
        };

        public static Songs ToEntity(this BriefSongCreationDTO dto)
        {
            var song = new Songs
            {
                Title = dto.Title,
                CreationDate = dto.CreationDate ?? DateTime.UtcNow
            };

            if (dto.ArtistIds?.Any() == true)
            {
                song.SongArtists = dto.ArtistIds
                    .Select(id => new SongArtists { ArtistId = id })
                    .ToList();
            }

            return song;
        }

        public static void ToEntity(this BriefSongUpdateDTO dto, Songs existing)
        {
            existing.Title = dto.Title;

            existing.SongArtists = dto.ArtistIds?
                .Select(artistId => new SongArtists
                {
                    ArtistId = artistId,
                    SongId = existing.Id
                })
                .ToList() ?? new List<SongArtists>();
        }


        public static List<SongAlternativeTitles> ToAlternativeEntities(this AlternativeTitlesSongDTO dto, int songId)
        {
            if (dto.Title.Count != dto.Language.Count)
                throw new ArgumentException(
                  "Titles and Languages count must match", nameof(dto));

            return dto.Title
                .Select((title, idx) => new SongAlternativeTitles
                {
                    SongId = songId,
                    AlternativeTitle = title,
                    Language = dto.Language[idx]
                })
                .ToList();
        }
    }
}
