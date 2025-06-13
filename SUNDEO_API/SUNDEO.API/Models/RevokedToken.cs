namespace SUNDEO.API.Models
{
    using System.ComponentModel.DataAnnotations;

    public class RevokedToken
    {
        [Key]
        public int TokenId { get; set; }

        public required string Token { get; set; }
        public DateTime RevokedAt { get; set; }
    }
}