import { useEffect, useState, type KeyboardEvent } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../styles/MarkerStyles.css';
import { useAuthStore } from '../stores/authStore';
import type { Patient } from '../types';
import { getPersons } from '../api/endpoints';

function SituationRoomTable() {
  const location = useLocation();
  const [persons, setPersons] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.2715, 16.403]);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const operationSceneId: number = location.state?.operationSceneId;

  function updateMapCenter(personsList: Patient[]) {
    if (personsList.length === 0) return;
    let count = 0;
    let latSum = 0;
    let lonSum = 0;
    for (const person of personsList) {
      if (person.latitude_patient != null && person.longitude_patient != null) {
        latSum += person.latitude_patient;
        lonSum += person.longitude_patient;
        count++;
      }
    }
    if (count > 0) setMapCenter([latSum / count, lonSum / count]);
  };

  useEffect(() => {
    getPersons(operationSceneId, token!)
      .then(({ data }) => {
        setPersons(data);
        updateMapCenter(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching persons:', error);
        setIsLoading(false);
      });
  }, [operationSceneId, token]);

  const getBackgroundColor = (triageColor: string | null): string => {
    if (!triageColor) return 'white';
    switch (triageColor.toLowerCase()) {
      case 'gelb':
        return 'yellow';
      case 'rot':
        return 'red';
      case 'grün':
        return 'green';
      case 'blau':
        return 'blue';
      case 'schwarz':
        return 'black';
      default:
        return 'white';
    }
  };

  const createMarkerIcon = (color: string) =>
    L.divIcon({
      className: 'custom-div-icon',
      html: `<div style='background-color:${color};' class='marker-pin'></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

  const renderMarkers = () =>
    persons.map((person) =>
      person.latitude_patient != null && person.longitude_patient != null ? (
        <Marker
          key={person.idpatient}
          position={[person.latitude_patient, person.longitude_patient]}
          icon={createMarkerIcon(getBackgroundColor(person.triagefarbe))}
        >
          <Popup>
            Nummer: {person.idpatient}
            <br />
            Kontaminiert: {person.kontaminiert ? 'Ja' : 'Nein'}
          </Popup>
        </Marker>
      ) : null
    );

  const openPage1 = (patientId: number) => {
    navigate(`/AmbulanzprotokollPage1/${patientId}`, { state: { operationSceneId } });
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, patientId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPage1(patientId);
    }
  };

  if (isLoading) return <p>Lädt...</p>;
  if (persons.length === 0) return <p>Keine Personen gefunden.</p>;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '0',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <table border={1} style={{ margin: 15 }}>
          <thead>
            <tr>
              <th>Nummer</th>
              <th>Atmung</th>
              <th>Blutung</th>
              <th>Triagefarbe</th>
              <th>Transport</th>
              <th>Dringend</th>
              <th>Name</th>
              <th>Position (Longitude)</th>
              <th>Position (Latitude)</th>
              <th>Erfasst</th>
              <th>Letztes Update</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr
                key={person.idpatient}
                role="button"
                tabIndex={0}
                aria-label={`Ambulanzprotokoll für Patient ${person.idpatient} öffnen`}
                onClick={() => openPage1(person.idpatient)}
                onKeyDown={(event) => handleRowKeyDown(event, person.idpatient)}
                style={{ cursor: 'pointer' }}
              >
                <td>{person.idpatient}</td>
                <td>{person.atmung ? 'Ja' : 'Nein'}</td>
                <td>{person.blutung ? 'Ja' : 'Nein'}</td>
                <td>
                  <div
                    style={{
                      backgroundColor: getBackgroundColor(person.triagefarbe),
                    }}
                  >
                    {person.triagefarbe}
                  </div>
                </td>
                <td>{person.transport ? 'Ja' : 'Nein'}</td>
                <td>{person.dringend ? 'Ja' : 'Nein'}</td>
                <td>{person.name || 'N/A'}</td>
                <td>{person.longitude_patient || 'N/A'}</td>
                <td>{person.latitude_patient || 'N/A'}</td>
                <td>{person.created_at}</td>
                <td>{person.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ flex: 1, height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {renderMarkers()}
        </MapContainer>
      </div>
    </div>
  );
}

export default SituationRoomTable;
