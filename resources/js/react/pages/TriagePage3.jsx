import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/TriagePage.css"; 

/**
 * Component for the third page of patient triage in an emergency situation.
 */
export default function TriagePage3() {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [red, setRed] = useState(false);
  const [yellow, setYellow] = useState(false);
  const patientId = location.state?.patientId;
  const operationScene = location.state?.operationScene;

  const [position, setPosition] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  /** Fetches the user's geolocation coordinates. */
  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      if (isMounted) {
        setPosition((prev) => ({
          ...prev,
          loaded: true,
          error: { message: "Geolocation is not supported by your browser" },
        }));
      }
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted) {
            setPosition({
              loaded: true,
              coordinates: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
              error: null,
            });
          }
        },
        (error) => {
          if (isMounted) {
            setPosition((prev) => ({
              ...prev,
              loaded: true,
              error,
            }));
          }
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  /** Updates the triage color of the patient and sends the update to the server. */
  const updateTriageColor = async (color) => {
    if (!patientId) {
      console.error("Keine Patienten-ID verfügbar");
      return;
    }
    if (!position.loaded || position.error) {
      console.error("Koordinaten sind nicht verfügbar.");
      return;
    }

    let requestBody;
    switch (color) {
      case "rot":
        requestBody = {
          triageColor: color,
          lat: position.coordinates.lat,
          lng: position.coordinates.lng,
          bloodStopable: false,
        };
        break;
      case "gelb":
        requestBody = {
          triageColor: color,
          lat: position.coordinates.lat,
          lng: position.coordinates.lng,
          bloodStopable: true,
        };
        break;
      default:
        requestBody = {
          triageColor: color,
          lat: position.coordinates.lat,
          lng: position.coordinates.lng,
        };
    }

    try {
      const response = await fetch(`/api/persons/${patientId}/update-triage-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Serverantwort war nicht ok");
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Triagefarbe:", error);
    }
  };

  /** Handlers */
  const handleRed = () => {
    setRed(true);
    updateTriageColor("rot");
  };

  const handleYellow = () => {
    setYellow(true);
    updateTriageColor("gelb");
  };

  const handleNewPatient = () => {
    navigate("/ScanPatient", { state: { operationScene } });
  };

  const handleBodyClick = () => {
    navigate("/ShowBodyFront", { state: { patientId, fromTriage: "TriagePage3" } });
  };

  /** Render */
  function renderContent() {
    if (!red && !yellow) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">
            Patient:In ID: {patientId} <br />
            nicht gehfähig <br />
            Atmung suffizient
          </p>

          <div className="triage-actions">
            <button className="btn btn-primary" onClick={handleYellow}>
              Blutung stillbar
            </button>
            <button className="btn btn-danger" onClick={handleRed}>
              Blutung nicht stillbar
            </button>
          </div>
        </div>
      );
    } else if (red) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">
            Patient:In ID: {patientId} <br />
            nicht gehfähig <br />
            Atmung
          </p>

          <p className="triage-badge red">
            Patient wurde mit der Kategorie <strong>ROT</strong> versehen
          </p>

          <button className="btn btn-primary" onClick={handleNewPatient}>
            Nächsten Patienten laden
          </button>
        </div>
      );
    } else if (yellow) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">
            Patient:In ID: {patientId} <br />
            nicht gehfähig <br />
            Atmung
          </p>

          <p className="triage-badge yellow">
            Patient wurde mit der Kategorie <strong>GELB</strong> versehen
          </p>

          <button className="btn btn-primary" onClick={handleNewPatient}>
            Nächsten Patienten laden
          </button>
        </div>
      );
    }
  }

  return (
    <div className="triage-page" role="main" aria-labelledby="triageTitle3">
      <div className="triage-card">
        <h2 id="triageTitle3" className="triage-title">
          Triage – Stufe 3
        </h2>

        {renderContent()}

        <button className="triage-fab" onClick={handleBodyClick} title="Körperansicht">
          👤
        </button>
      </div>
    </div>
  );
}
