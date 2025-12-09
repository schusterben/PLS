import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import "./../../../css/CreateOperationScene.css";

/**
 * Component for creating a new operation scene.
 */
export default function CreateOperationScene() {
  const [sceneData, setSceneData] = useState({ name: "", description: "" });
  const { adminToken } = useStateContext();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /** Handle changes in the input fields. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSceneData({ ...sceneData, [name]: value });
  };

  /** Handle form submission to create a new operation scene. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/createOperationScene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(sceneData),
      });

      if (!response.ok) throw new Error("Fehler beim Senden der Anfrage.");

      const data = await response.json();

      if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
        setErrorMessage("Nicht autorisiert. Bitte melden Sie sich erneut an.");
        return;
      }

      if (data.operactionScene || data.success) {
        setSuccessMessage("Einsatzort wurde erfolgreich erstellt.");
        setSceneData({ name: "", description: "" });
      } else {
        setErrorMessage("Einsatzort konnte nicht erstellt werden.");
      }
    } catch (error) {
      setErrorMessage("Einsatzort konnte nicht angelegt werden. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="scene-create-page">
      <h1 className="scene-title">Neuen Einsatzort erstellen</h1>

      {successMessage && <p className="scene-status success">{successMessage}</p>}
      {errorMessage && <p className="scene-status error">{errorMessage}</p>}

      <p className="scene-hint">
        Der Einsatzort steht nach Erstellung <strong>20 Tage</strong> in der Liste der Einsatzorte zur Auswahl.
      </p>

      <form onSubmit={handleSubmit} className="scene-form">
        <div className="scene-input-group">
          <label htmlFor="sceneName" className="scene-label">
            Name des Einsatzorts:
          </label>
          <input
            id="sceneName"
            type="text"
            name="name"
            value={sceneData.name}
            onChange={handleInputChange}
            placeholder="Name des Einsatzorts eingeben"
            className="scene-input"
            required
          />
        </div>

        <div className="scene-input-group">
          <label htmlFor="sceneDescription" className="scene-label">
            Beschreibung:
          </label>
          <textarea
            id="sceneDescription"
            name="description"
            value={sceneData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Beschreibung des Einsatzorts eingeben"
            className="scene-textarea"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary full">
          Einsatzort erstellen
        </button>
      </form>
    </div>
  );
}
