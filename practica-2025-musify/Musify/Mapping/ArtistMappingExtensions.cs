using Domain.Entities;
using Musify.DTOs.ArtistDTOs;
using Domain.Enums;
using System.Security.Cryptography.X509Certificates;

namespace Musify.Mapping
{
    public static class ArtistMappingExtensions
    {
        public static Artists ToEntity(this ArtistDto dto)
        {
            var artist = new Artists
            {
                Type = dto.Type,
                ActiveStart = dto.ActiveStart,
                ActiveEnd = dto.ActiveEnd
            };

            if (ArtistEnum.person.ToString() == dto.Type)
            {
                artist.StageName = dto.StageName;
                artist.FirstName = dto.FirstName;
                artist.LastName = dto.LastName;
                artist.Birthday = dto.Birthday;
            }
            else if (ArtistEnum.band.ToString() == dto.Type)
            {
                artist.BandName = dto.BandName;
                artist.Location = dto.Location;
            }

            return artist;
        }

        public static ArtistDto ToDto(this Artists artist)
        {
            var dto = new ArtistDto
            {
                Type = artist.Type,
                ActiveStart = artist.ActiveStart,
                ActiveEnd = artist.ActiveEnd
            };

            if (ArtistEnum.person.ToString() == dto.Type)
            {
                artist.StageName = dto.StageName;
                artist.FirstName = dto.FirstName;
                artist.LastName = dto.LastName;
                artist.Birthday = dto.Birthday;
            }
            else if (ArtistEnum.band.ToString() == dto.Type)
            {
                artist.BandName = dto.BandName;
                artist.Location = dto.Location;
            }

            return dto;
        }


        public static Artists ToEntity(this ArtistUpdateDto dto)
        {
            var artist = new Artists
            {
                Id = dto.Id,
                StageName = dto.StageName,
                BandName = dto.BandName,
                Location = dto.Location,
                ActiveStart = dto.ActiveStart,
                ActiveEnd = dto.ActiveEnd,
                Type = dto.Type
            };

            return artist;
           
        }
    }
}
