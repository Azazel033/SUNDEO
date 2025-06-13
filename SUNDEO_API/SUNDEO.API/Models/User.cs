using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int UserId { get; set; }

    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string Role { get; set; }

    public ICollection<SolarPlant> SolarPlants { get; set; } = new List<SolarPlant>();
}
