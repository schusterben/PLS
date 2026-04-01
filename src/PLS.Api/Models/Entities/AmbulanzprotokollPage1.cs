namespace PLS.Api.Models.Entities;

public class AmbulanzprotokollPage1
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string FormStateJson { get; set; } = "{}";
    public string Status { get; set; } = "draft";
    public DateTime? FinalizedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Patient? Patient { get; set; }
}
