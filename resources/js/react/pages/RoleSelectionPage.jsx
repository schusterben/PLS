import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./../../../css/RoleSelection.css";

/**
 * RoleSelection component for selecting user roles and operation scenes.
 */
export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");
  const [nextPage, setNextPage] = useState(""); 
  const [submitted, setSubmitted] = useState(""); 
  const { token, setToken } = useStateContext();  
  const [selectedOperationScene, setSelectedOperationScene] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existingOperationScenes, setExistingOperationScenes] = useState([]);

  const roles = []; 

  /** Handle the change event for selecting an operation scene. */
  const handleOptionChange = (event) => {
    const selectedId = event.target.value;
    setSelectedOperationScene(selectedId);
  };

  /** Handle the change event for selecting a user role. */
  const handleRoleChange = (item) => {
    setSelectedRole(item.target.value);
  };

  /** Handle the form submission based on the selected user role. */
  const handleSubmit = (event) => {
    event.preventDefault();

    switch (selectedRole.toUpperCase()) {
      case "TRIAGE":
        navigate("/ScanPatient", {
          state: {
            operationScene: selectedOperationScene,
          },
        });
        break;
      case "LEITSTELLE":
        navigate("/SituationRoomTable", {
          state: { operationScene: selectedOperationScene },
        });
        break;
      default:
        navigate("/NotFound");
        break;
    }
  };

  useEffect(() => {
    // Fetch existing operation scenes from the server.
    const fetchExistingScenes = async () => {
      try {
        const response = await fetch("/api/getAllCurrentOperationScenes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
          navigate("/AdminLandingPage");
          return;
        }
        setExistingOperationScenes(data);
        setLoading(false);
      } catch (error) {
        console.error("Einsatzort konnte nicht geladen werden:", error);
      }
    };

    fetchExistingScenes();
  }, []); 

  return (
    <div className="role-page">
      {loading ? (
        <p className="role-status info">Lade bestehende Einsatzorte...</p>
      ) : (
        <div className="role-card">
          <h3 className="role-title">Willkommen bei der Rolenauswahl</h3>
          <h4 className="role-subtitle">Sie sind im Einsatz für</h4>

          <select
            value={selectedOperationScene}
            onChange={handleOptionChange}
            className="role-select"
            aria-label="Einsatzort auswählen"
          >
            <option value="">Wähle einen Einsatzort aus</option>
            {existingOperationScenes.map((scene) => (
              <option
                key={scene.idoperationScene}
                value={JSON.stringify(scene)}
              >
                {scene.name}
              </option>
            ))}
          </select>

          <p className="role-helper">in Funktion als</p>

          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="role-select"
            aria-label="Rolle auswählen"
          >
            <option value="">Rolle auswählen</option>
            <option value="Triage">Triage</option>
            <option value="Leitstelle">Leitstelle</option>
          </select>

          <form onSubmit={handleSubmit} className="role-submitbar">
            <button type="submit" className="btn btn-primary">
              Bestätigen
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
