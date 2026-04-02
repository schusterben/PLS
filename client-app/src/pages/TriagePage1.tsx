import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePatientTriage } from '../hooks/usePatientTriage';
import { TRIAGE_COLOR } from '../types/triageColor';
import { usePatientLocationStore } from '../stores/patientLocationStore';
import PatientLocationStatus from '../components/PatientLocationStatus';

export default function TriagePage1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [green, setGreen] = useState(false);
  const [black, setBlack] = useState(false);
  const patientId = location.state?.patientId;
  const operationSceneId: number = location.state?.operationSceneId;
  const ensurePatientLocation = usePatientLocationStore((state) => state.ensurePatientLocation);
  const { setTriageColor } = usePatientTriage(patientId);

  useEffect(() => {
    void ensurePatientLocation(patientId);
  }, [ensurePatientLocation, patientId]);

  const handleGreen = () => {
    setGreen(true);
    setTriageColor(TRIAGE_COLOR.GRUEN);
  };

  const handleBlack = () => {
    setBlack(true);
    setTriageColor(TRIAGE_COLOR.SCHWARZ);
  };

  const handleNextPage = () => {
    navigate('/TriagePage2', { state: { patientId, operationSceneId } });
  };

  const handleNewPatient = () => {
    navigate('/ScanPatient', { state: { operationSceneId } });
  };

  const handleBodyClick = () => {
    navigate('/ShowBodyFront', { state: { patientId } });
  };

  function renderContent() {
    if (!black && !green) {
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
              <button onClick={handleGreen}>
                Patient gehfähig (ohne weitere Verletzungen)
              </button>
              <button onClick={handleNextPage}>
                Patient nicht gehfähig (und/oder weitere Verletzungen)
              </button>
            </div>
            <button onClick={handleBlack} style={{ width: '90%', height: '5rem' }}>
              eindeutiges Todeszeichen
            </button>
          </div>
        </div>
      );
    } else if (green) {
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
          </p>
          <p
            style={{
              border: '2px solid green',
              padding: '2%',
              display: 'inline-block',
              color: 'green',
            }}
          >
            Patient wurde mit der Kategorie GRÜN versehen
          </p>
          <button onClick={handleNewPatient}>Nächsten Patienten laden</button>
        </div>
      );
    } else if (black) {
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
          </p>
          <p
            style={{
              border: '2px solid #000',
              margin: '5%',
              padding: '2%',
              display: 'inline-block',
            }}
          >
            Patient wurde mit der Kategorie SCHWARZ versehen
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
      <h4>GPS Status:</h4>
      <PatientLocationStatus patientId={patientId} />
    </div>
  );
}
