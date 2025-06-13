using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Battery
{
    [Key]
    public int BatteryId { get; set; }

    [ForeignKey("SolarPlant")]
    public int PlantId { get; set; }

    public required string Model { get; set; }
    public decimal CapacityKwh { get; set; }
    public decimal Efficiency { get; set; }
    public DateTime InstallationDate { get; set; }

    [JsonIgnore]
    public SolarPlant? SolarPlant { get; set; }
}
