using Musify.DTOs.ArtistDTOs;
using Domain.Enums;
namespace Musify.Validations
{
    public class ArtistControllerValidator
    {
        public static List<string> ValidateArtistCreate(ArtistDto dto)
        {
            var errors = new List<string>();


            if (!dto.ActiveStart.HasValue)
                errors.Add("ActiveStart is required.");

            if (dto.ActiveEnd.HasValue)
            {
                if (dto.ActiveStart.Value > dto.ActiveEnd.Value)
                {
                    errors.Add("ActiveStart must be before ActiveEnd.");
                }
            }

            if (ArtistEnum.person.ToString() == dto.Type)
            {

                if (string.IsNullOrWhiteSpace(dto.StageName))
                    errors.Add("StageName is required.");

                if (string.IsNullOrWhiteSpace(dto.LastName))
                    errors.Add("LastName is required.");

                if (string.IsNullOrWhiteSpace(dto.FirstName))
                    errors.Add("FirstName is required.");

                if (!dto.Birthday.HasValue)
                    errors.Add("Birthday is required.");

                return errors;
            }

            if (ArtistEnum.band.ToString() == dto.Type) {

                if (string.IsNullOrWhiteSpace(dto.BandName))
                    errors.Add("BandName is required.");

                if (string.IsNullOrWhiteSpace(dto.Location))
                    errors.Add("Location is required.");

                return errors;

            }

            errors.Add("Inccorect type.");
            return errors;

        }

        public static List<string> ValidateArtistUpdate(ArtistUpdateDto dto)
        {
            var errors = new List<string>();

            if (!dto.ActiveStart.HasValue)
                errors.Add("ActiveStart is required.");

            if (dto.ActiveEnd.HasValue)
            {
                if (dto.ActiveStart.Value > dto.ActiveEnd.Value)
                {
                    errors.Add("ActiveStart must be before ActiveEnd.");
                }
            }

            if (dto.Id <= 0)
                errors.Add("Valid UserId is required.");

            if (ArtistEnum.person.ToString() == dto.Type)
            {
                if (string.IsNullOrWhiteSpace(dto.StageName))
                    errors.Add("StageName is required.");

                return errors;
            }
            else if (ArtistEnum.band.ToString() == dto.Type)
            {
                if (string.IsNullOrWhiteSpace(dto.BandName))
                    errors.Add("BandName is required.");

                if (string.IsNullOrWhiteSpace(dto.Location))
                    errors.Add("Location is required.");

                return errors;
            }

            errors.Add("Inccorect type.");
            return errors;
        }
    }
}
