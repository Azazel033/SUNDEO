using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class SolarPlant
{
    [Key]
    public int PlantId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    public string PlantName { get; set; } = string.Empty;
    public decimal CapacityKw { get; set; }
    public DateTime InstallDate { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    [JsonIgnore]
    public User? User { get; set; }
}
