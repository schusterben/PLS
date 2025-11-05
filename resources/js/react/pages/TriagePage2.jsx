import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/TriagePage.css";

/**
 * Component for the second page of patient triage in an emergency situation.
 */
export default function TriagePage2() {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [red, setRed] = useState(false);
  const patientId = location.state?.patientId;
  const operationScene = location.state?.operationScene;

  const [position, setPosition] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  /** Fetch GPS coordinates */
  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      if (isMounted) {
        setPosition({
          loaded: true,
          coordinates: { lat: "", lng: "" },
          error: { message: "Geolocation is not supported by your browser" },
        });
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
            setPosition({
              loaded: true,
              coordinates: { lat: "", lng: "" },
              error,
            });
          }
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  /** Update triage color (rot) */
  const updateTriageColor = async (color) => {
    if (!patientId) return console.error("Keine Patienten-ID verfügbar");
    if (!position.loaded || position.error)
      return console.error("Koordinaten sind nicht verfügbar.");

    const requestBody = {
      triageColor: color,
      lat: position.coordinates.lat,
      lng: position.coordinates.lng,
      respiration: false,
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

      if (!response.ok) throw new Error("Serverantwort war nicht ok");
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Triagefarbe:", error);
    }
  };

  /** Button handler – rot */
  const handleRed = () => {
    setRed(true);
    updateTriageColor("rot");
  };

  /** Button handler – Atmung suffizient (weiter zur Page 3) */
  const handleNextPage = async () => {
    const requestBody = {
      lat: position.coordinates.lat,
      lng: position.coordinates.lng,
      respiration: true,
    };

    try {
      const response = await fetch(`/api/persons/${patientId}/respiration`, {
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
      console.error("Fehler beim Aktualisieren der Atmung:", error);
    }

    navigate("/TriagePage3", {
      state: { patientId, operationScene },
    });
  };

  /** Button handler – Neuer Patient */
  const handleNewPatient = () => {
    navigate("/ScanPatient", {
      state: { operationScene },
    });
  };

  /** Button handler – Körperansicht */
  const handleBodyClick = () => {
    navigate("/ShowBodyFront", {
      state: { patientId, fromTriage: "TriagePage2" },
    });
  };

  /** UI Render logic */
  function renderContent() {
    if (!red) {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">
            Patient:In ID: {patientId} <br /> nicht gehfähig
          </p>

          <div className="triage-actions">
            <button className="btn btn-primary" onClick={handleNextPage}>
              Atmung suffizient
            </button>
            <button className="btn btn-danger" onClick={handleRed}>
              Atmung nicht suffizient
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="triage-stage">
          <p className="triage-patient-id">
            Patient:In ID: {patientId} <br /> nicht gehfähig
          </p>

          <p className="triage-badge red">
            Patient wurde mit der Kategorie <strong>ROT</strong> versehen
          </p>

          <button className="btn btn-primary" onClick={handleNewPatient}>
            Nächsten Patienten laden
          </button>
        </div>
      );
    }
  }

  return (
    <div className="triage-page" role="main" aria-labelledby="triageTitle2">
      <div className="triage-card">
        <h2 id="triageTitle2" className="triage-title">
          Triage – Stufe 2
        </h2>

        {renderContent()}

        <button className="triage-fab" onClick={handleBodyClick} title="Körperansicht">
          👤
        </button>
      </div>
    </div>
  );
}
