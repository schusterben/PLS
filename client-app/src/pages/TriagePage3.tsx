import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePatientTriage } from '../hooks/usePatientTriage';
import { TRIAGE_COLOR } from '../types/triageColor';
import { usePatientLocationStore } from '../stores/patientLocationStore';
import PatientLocationStatus from '../components/PatientLocationStatus';

export default function TriagePage3() {
  const navigate = useNavigate();
  const location = useLocation();
  const [red, setRed] = useState(false);
  const [yellow, setYellow] = useState(false);
  const patientId = location.state?.patientId;
  const operationSceneId: number = location.state?.operationSceneId;
  const ensurePatientLocation = usePatientLocationStore((state) => state.ensurePatientLocation);
  const { setTriageColor } = usePatientTriage(patientId);

  useEffect(() => {
    void ensurePatientLocation(patientId);
  }, [ensurePatientLocation, patientId]);

  const handleRed = () => {
    setRed(true);
    setTriageColor(TRIAGE_COLOR.ROT, { blutung: false });
  };

  const handleYellow = () => {
    setYellow(true);
    setTriageColor(TRIAGE_COLOR.GELB, { blutung: true });
  };

  const handleNewPatient = () => {
    navigate('/ScanPatient', { state: { operationSceneId } });
  };

  const handleBodyClick = () => {
    navigate('/ShowBodyFront', { state: { patientId } });
  };

  function renderContent() {
    if (!red && !yellow) {
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
            <br /> Atmung suffizient
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
              <button onClick={handleYellow}>Blutung Stillbar</button>
              <button onClick={handleRed}>Blutung nicht stillbar</button>
            </div>
          </div>
        </div>
      );
    } else if (red) {
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
            <br /> Atmung
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
    } else if (yellow) {
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
            <br /> Atmung
          </p>
          <p
            style={{
              border: '2px solid yellow',
              margin: '5%',
              padding: '2%',
              display: 'inline-block',
              color: 'yellow',
            }}
          >
            Patient wurde mit der Kategorie Gelb versehen
          </p>
          <button onClick={handleNewPatient}>Nächsten Patienten laden</button>
        </div>
      );
    }
  }

  return (
    <div>
      {renderContent()}
      <PatientLocationStatus patientId={patientId} />
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
