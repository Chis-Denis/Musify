using Domain.Entities;
using Musify.DTOs.Security;
using Musify.DTOs.UserDTOs;

namespace Musify.Mapping
{
    public static class UserMappingExtensions
    {
        public static UserReadDto ToDto(this Users src) => new()
        {
            Id = src.Id,
            FirstName = src.FirstName,
            LastName = src.LastName,
            Email = src.Email,
            Country = src.Country,
            Role = src.Role,
            IsActive = src.IsActive,
            IsDeleted = src.IsDeleted
        };

        public static Users ToEntity(this UserCreateDto dto) => new()
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = dto.Password,
            Country = dto.Country,
            Role = dto.Role,
            IsActive = dto.IsActive,
            Token = string.Empty
        };

        public static Users ToEntity(this UserUpdateDto dto) {
            return new Users
            {
                Id = dto.Id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Country = dto.Country,
                Role = dto.Role,
                IsActive = dto.IsActive,
                IsDeleted = dto.IsDeleted
            };
        }

        public static Users ToEntity(this UserRegisterDto dto)
        {
            return new Users
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = dto.Password,
                Country = dto.Country,
                Role = "user", 
                IsActive = true,
                IsDeleted = false,
                Token = ""
            };
        }
    }
}
