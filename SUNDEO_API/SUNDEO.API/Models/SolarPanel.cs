using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class SolarPanel
{
    [Key]
    public int PanelId { get; set; }

    [ForeignKey("SolarPlant")]
    public int PlantId { get; set; }

    public required string Model { get; set; }
    public int PowerRatingW { get; set; }
    public required string Orientation { get; set; }
    public decimal TiltAngle { get; set; }
    public DateTime InstallationDate { get; set; }

    [JsonIgnore]
    public SolarPlant? SolarPlant { get; set; }
}
