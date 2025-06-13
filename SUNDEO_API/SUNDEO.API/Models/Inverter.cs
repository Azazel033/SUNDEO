using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Inverter
{
    [Key]
    public int InverterId { get; set; }

    [ForeignKey("SolarPlant")]
    public int PlantId { get; set; }

    public required string Model { get; set; }
    public decimal MaxPowerKw { get; set; }
    public decimal Efficiency { get; set; }
    public required string SerialNumber { get; set; }
    public DateTime InstallationDate { get; set; }

    [JsonIgnore]
    public SolarPlant? SolarPlant { get; set; }
}
