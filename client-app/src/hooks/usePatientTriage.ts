import { useAuthStore } from '../stores/authStore';
import { updateTriageColor, updateRespiration } from '../api/endpoints';
import type { GeoPosition } from './useGeolocation';

export function usePatientTriage(patientId: number | undefined, position: GeoPosition) {
  const { token } = useAuthStore();

  const setTriageColor = async (
    color: string,
    extra?: { respiration?: boolean; blutung?: boolean }
  ) => {
    if (!patientId || !position.loaded || position.error) return;
    try {
      await updateTriageColor(
        patientId,
        {
          triageColor: color,
          lat: position.coordinates.lat as number,
          lng: position.coordinates.lng as number,
          ...extra,
        },
        token!
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Triagefarbe:', error);
    }
  };

  const setRespiration = async (value: boolean) => {
    if (!patientId || !position.loaded) return;
    try {
      await updateRespiration(
        patientId,
        {
          respiration: value,
          lat: position.coordinates.lat as number,
          lng: position.coordinates.lng as number,
        },
        token!
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Atmung:', error);
    }
  };

  return { setTriageColor, setRespiration };
}
