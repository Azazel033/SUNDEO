using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class EnergyProduction
{
    [Key]
    public int ProductionId { get; set; }

    [ForeignKey("SolarPlant")]
    public int PlantId { get; set; }

    public DateTime Timestamp { get; set; }
    public decimal EnergyKwh { get; set; }
    public decimal DcVoltage { get; set; }
    public decimal AcVoltage { get; set; }
    public decimal? Temperature { get; set; }

    [JsonIgnore]
    public SolarPlant? SolarPlant { get; set; }
}
