using Musify.DTOs.UserDTOs;

namespace Musify.Validations
{
    public class UserValidation
    {
        public Dictionary<string, string> ValidateUserCreate(UserCreateDto dto)
        {
            var errors = new Dictionary<string, string>();

            if (string.IsNullOrWhiteSpace(dto.FirstName))
                errors.Add("FirstName", "First name is required.");

            if (string.IsNullOrWhiteSpace(dto.LastName))
                errors.Add("LastName", "Last name is required.");

            if (!string.IsNullOrWhiteSpace(dto.Email) && !dto.Email.Contains("@"))
                errors.Add("Email", "Invalid email format.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                errors.Add("Password", "Password is required.");

            if (string.IsNullOrWhiteSpace(dto.Role))
                errors.Add("Role", "Role is required.");

            return errors;
        }

        public Dictionary<string, string> ValidateUserUpdate(UserUpdateDto dto)
        {
            var errors = new Dictionary<string, string>();

            if (string.IsNullOrWhiteSpace(dto.FirstName))
                errors.Add("FirstName", "First name is required.");

            if (string.IsNullOrWhiteSpace(dto.LastName))
                errors.Add("LastName", "Last name is required.");

            if (!string.IsNullOrWhiteSpace(dto.Email) && !dto.Email.Contains("@"))
                errors.Add("Email", "Invalid email format.");

            if (string.IsNullOrWhiteSpace(dto.Role))
                errors.Add("Role", "Role is required.");

            return errors;
        }
    }
}
