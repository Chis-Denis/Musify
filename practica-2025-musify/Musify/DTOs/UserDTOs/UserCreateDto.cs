namespace Musify.DTOs.UserDTOs
{
    public class UserCreateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }
}

