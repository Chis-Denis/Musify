namespace Musify.DTOs.UserDTOs
{
    public class UserReadDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }

}
