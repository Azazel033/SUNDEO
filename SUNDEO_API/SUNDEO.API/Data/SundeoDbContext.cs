using Microsoft.EntityFrameworkCore;
using SUNDEO.API.Models;

public class SundeoDbContext : DbContext
{
    public SundeoDbContext(DbContextOptions<SundeoDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<SolarPlant> SolarPlants { get; set; }
    public DbSet<Battery> Batteries { get; set; }
    public DbSet<Inverter> Inverters { get; set; }
    public DbSet<SolarPanel> SolarPanels { get; set; }
    public DbSet<EnergyProduction> EnergyProductions { get; set; }
    public DbSet<RevokedToken> RevokedTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Establecer precisión decimal global
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(decimal))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(property.Name)
                        .HasPrecision(18, 2);
                }
            }
        }

        // User → SolarPlant
        modelBuilder.Entity<SolarPlant>()
            .HasOne(p => p.User)
            .WithMany(u => u.SolarPlants)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Battery → SolarPlant
        modelBuilder.Entity<Battery>()
            .HasOne(b => b.SolarPlant)
            .WithMany()
            .HasForeignKey(b => b.PlantId)
            .OnDelete(DeleteBehavior.Cascade);

        // Inverter → SolarPlant
        modelBuilder.Entity<Inverter>()
            .HasOne(i => i.SolarPlant)
            .WithMany()
            .HasForeignKey(i => i.PlantId)
            .OnDelete(DeleteBehavior.Cascade);

        // SolarPanel → SolarPlant
        modelBuilder.Entity<SolarPanel>()
            .HasOne(sp => sp.SolarPlant)
            .WithMany()
            .HasForeignKey(sp => sp.PlantId)
            .OnDelete(DeleteBehavior.Cascade);

        // EnergyProduction → SolarPlant
        modelBuilder.Entity<EnergyProduction>()
            .HasOne(ep => ep.SolarPlant)
            .WithMany()
            .HasForeignKey(ep => ep.PlantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
