namespace PLS.Api.Models.Entities;

public class Patient
{
    public int Id { get; set; }
    public string? Atmung { get; set; }
    public string? Blutung { get; set; }
    public string? Radialispuls { get; set; }
    public string? Triagefarbe { get; set; }
    public string? Transport { get; set; }
    public string? Dringend { get; set; }
    public string? Kontaminiert { get; set; }
    public string? Name { get; set; }
    public double? LongitudePatient { get; set; }
    public double? LatitudePatient { get; set; }
    public int? UserIdUser { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public User? User { get; set; }
    public Body? Body { get; set; }
    public AmbulanzprotokollPage1? AmbulanzprotokollPage1 { get; set; }
    public QrCodePatient? QrCodePatient { get; set; }
}
