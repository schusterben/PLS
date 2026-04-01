namespace PLS.Api.Models.DTOs;

public record GenerateQrCodesRequest(int number);
public record GenerateQrCodesResponse(string status, List<string> qrcodes);
