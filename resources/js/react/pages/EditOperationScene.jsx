import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./../../../css/EditOperationScene.css";

/**
 * Component for editing operation scenes.
 * Allows users to select, modify, and create operation scenes.
 */
export default function EditOperationScene() {
  const navigate = useNavigate();
  const { adminToken } = useStateContext();
  const [sceneData, setSceneData] = useState({ name: "", description: "" });
  const [selectedOperationScene, setSelectedOperationScene] = useState("");
  const [existingOperationScenes, setExistingOperationScenes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingScenes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getAllCurrentOperationScenes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setExistingOperationScenes(data);
      } catch (error) {
        setErrorMessage("Einsatzorte konnten nicht geladen werden.");
        console.error("Error fetching operation scenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingScenes();
  }, [adminToken]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedOperationScene(selectedId);

    const selectedScene = existingOperationScenes.find(
      (scene) => scene.idoperationScene === parseInt(selectedId)
    );

    setSceneData(
      selectedScene
        ? { name: selectedScene.name, description: selectedScene.description || "" }
        : { name: "", description: "" }
    );
  };

  const handleInputChange = (field, value) => {
    setSceneData((prevData) => ({ ...prevData, [field]: value }));
  };

  const onClickUpdateOperationScene = async () => {
    try {
      const response = await fetch("/api/createOperationScene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          id: selectedOperationScene,
          name: sceneData.name,
          description: sceneData.description,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      await response.json();
      setSuccessMessage("Einsatzort wurde erfolgreich aktualisiert.");
      setErrorMessage("");

      // Refresh list
      const refreshedResponse = await fetch("/api/getAllCurrentOperationScenes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const refreshedData = await refreshedResponse.json();
      setExistingOperationScenes(refreshedData);
      setSelectedOperationScene("");
      setSceneData({ name: "", description: "" });
    } catch (error) {
      setErrorMessage("Einsatzort konnte nicht aktualisiert werden.");
      console.error("Error updating operation scene:", error);
    }
  };

  const onClickCreateOperationScene = () => {
    navigate("/CreateOperationScene");
  };

  return (
    <div className="scene-edit-page">
      <h1 className="scene-title">Einsatzort bearbeiten</h1>

      {loading && <p className="scene-status info">Lade bestehende Einsatzorte...</p>}
      {errorMessage && <p className="scene-status error">{errorMessage}</p>}
      {successMessage && <p className="scene-status success">{successMessage}</p>}

      {!loading && (
        <div className="scene-form">
          <label htmlFor="sceneSelect" className="scene-label">
            Einsatzort auswählen:
          </label>
          <select
            id="sceneSelect"
            value={selectedOperationScene}
            onChange={handleSelectChange}
            className="scene-select"
          >
            <option value="">Wähle einen Einsatzort aus</option>
            {existingOperationScenes.map((scene) => (
              <option key={scene.idoperationScene} value={scene.idoperationScene}>
                {scene.name}
              </option>
            ))}
          </select>

          {selectedOperationScene && (
            <>
              <div className="scene-input-group">
                <label className="scene-label">Name des Einsatzorts:</label>
                <input
                  type="text"
                  value={sceneData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="scene-input"
                  required
                />
              </div>

              <div className="scene-input-group">
                <label className="scene-label">Beschreibung:</label>
                <textarea
                  value={sceneData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="scene-textarea"
                  rows={4}
                />
              </div>

              <button onClick={onClickUpdateOperationScene} className="btn btn-primary full">
                Einsatzort aktualisieren
              </button>
            </>
          )}

          <button onClick={onClickCreateOperationScene} className="btn btn-ghost full">
            Neuen Einsatzort erstellen
          </button>
        </div>
      )}
    </div>
  );
}
