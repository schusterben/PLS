import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePatientTriage } from '../hooks/usePatientTriage';

export default function TriagePage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [red, setRed] = useState(false);
  const patientId = location.state?.patientId;
  const operationSceneId: number = location.state?.operationSceneId;
  const position = useGeolocation();
  const { setTriageColor, setRespiration } = usePatientTriage(patientId, position);

  const handleRed = () => {
    setRed(true);
    setTriageColor('rot', { respiration: false });
  };

  const handleNextPage = async () => {
    await setRespiration(true);
    navigate('/TriagePage3', { state: { patientId, operationSceneId } });
  };

  const handleNewPatient = () => {
    navigate('/ScanPatient', { state: { operationSceneId } });
  };

  const handleBodyClick = () => {
    navigate('/ShowBodyFront', { state: { patientId } });
  };

  function renderContent() {
    if (!red) {
      return (
        <div>
          <p
            style={{
              position: 'absolute',
              top: '13%',
              left: '0',
              width: '100%',
              textAlign: 'center',
              padding: '0',
            }}
          >
            Patient:In ID: {patientId}
            <br /> nicht gehfähig
          </p>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '4%',
                padding: '5%',
                marginBottom: '15%',
              }}
            >
              <button onClick={handleNextPage}>Atmung suffizient</button>
              <button onClick={handleRed}>Atmung nicht suffizient</button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p
            style={{
              position: 'absolute',
              top: '13%',
              left: '0',
              width: '100%',
              textAlign: 'center',
              padding: '0',
            }}
          >
            Patient:In ID: {patientId}
            <br /> nicht gehfähig
          </p>
          <p
            style={{
              border: '2px solid red',
              margin: '5%',
              padding: '2%',
              display: 'inline-block',
              color: 'red',
            }}
          >
            Patient wurde mit der Kategorie ROT versehen
          </p>
          <button onClick={handleNewPatient}>Nächsten Patienten laden</button>
        </div>
      );
    }
  }

  return (
    <div>
      {renderContent()}
      <button
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          textAlign: 'center',
          padding: '0',
          fontSize: '2rem',
        }}
        onClick={handleBodyClick}
      >
        👤
      </button>
    </div>
  );
}
