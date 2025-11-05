import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/TriagePage.css";

/**
 * Component for triaging patients in an emergency situation.
 */
export default function TriagePage1() {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [green, setGreen] = useState(false);
  const [black, setBlack] = useState(false);
  const patientId = location.state?.patientId;
  const operationScene = location.state?.operationScene;

  const [position, setPosition] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  /** Fetch geolocation */
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

  /** API: update triage color */
  const updateTriageColor = async (color) => {
    if (!patientId) {
      console.error("Keine Patienten-ID verfügbar");
      return;
    }
    if (!position.loaded || position.error) {
      console.error("Koordinaten sind nicht verfügbar.");
      return;
    }

    const requestBody = {
      triageColor: color,
      lat: position.coordinates.lat,
      lng: position.coordinates.lng,
    };

    try {
      const response = await fetch(`/api/persons/${patientId}/update-triage-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Serverantwort war nicht ok");
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Triagefarbe:", error);
    }
  };

  /** Handlers */
  const handleGreen = () => {
    setGreen(true);
    updateTriageColor("grün");
  };

  const handleBlack = () => {
    setBlack(true);
    updateTriageColor("schwarz");
  };

  const handleNextPage = () => {
    navigate("/TriagePage2", {
      state: { patientId, operationScene },
    });
  };

  const handleNewPatient = () => {
    navigate("/ScanPatient", {
      state: { operationScene },
    });
  };

  const handleBodyClick = () => {
    navigate("/ShowBodyFront", {
      state: { patientId, fromTriage: "TriagePage1" },
    });
  };

  /** Render states */
  function renderContent() {
    if (!black && !green) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">Patient:In ID: {patientId}</p>

          <div className="triage-actions">
            <button className="btn btn-primary" onClick={handleGreen}>
              Patient gehfähig (ohne weitere Verletzungen)
            </button>
            <button className="btn btn-ghost" onClick={handleNextPage}>
              Patient nicht gehfähig (und/oder weitere Verletzungen)
            </button>
          </div>

          <button className="btn btn-danger full tall" onClick={handleBlack}>
            eindeutiges Todeszeichen
          </button>
        </div>
      );
    } else if (green) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">Patient:In ID: {patientId}</p>

          <p className="triage-badge green">
            Patient wurde mit der Kategorie <strong>GRÜN</strong> versehen
          </p>

          <button className="btn btn-primary" onClick={handleNewPatient}>
            Nächsten Patienten laden
          </button>
        </div>
      );
    } else if (black) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">Patient:In ID: {patientId}</p>

          <p className="triage-badge black">
            Patient wurde mit der Kategorie <strong>SCHWARZ</strong> versehen
          </p>

          <button className="btn btn-primary" onClick={handleNewPatient}>
            Nächsten Patienten laden
          </button>
        </div>
      );
    }
  }

  return (
    <div className="triage-page" role="main" aria-labelledby="triageTitle">
      <div className="triage-card">
        <h2 id="triageTitle" className="triage-title">
          Ersteinschätzung (Triage)
        </h2>

        {renderContent()}

        <button className="triage-fab" onClick={handleBodyClick} title="Körperansicht">
          👤
        </button>

        <div className="triage-gps">
          <h4>GPS Koordinaten:</h4>
          <p>Laden: {position.loaded ? "Erfolgreich" : "Lädt..."}</p>

          {position.loaded && !position.error && (
            <div className="triage-gps-grid">
              <p>
                <span className="gps-key">Breitengrad:</span> {position.coordinates.lat}
              </p>
              <p>
                <span className="gps-key">Längengrad:</span> {position.coordinates.lng}
              </p>
            </div>
          )}

          {position.error && (
            <p className="triage-status error">Fehler: {position.error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
