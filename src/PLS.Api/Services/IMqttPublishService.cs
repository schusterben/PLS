namespace PLS.Api.Services;

public interface IMqttPublishService
{
    Task PublishPatientStateAsync(int patientId);
}
