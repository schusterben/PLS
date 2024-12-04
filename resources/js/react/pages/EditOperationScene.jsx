import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

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

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

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

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setSuccessMessage("Einsatzort wurde erfolgreich aktualisiert.");
            setErrorMessage("");

            // Refresh the operation scenes after a successful update
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
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Einsatzort bearbeiten</h1>
            {loading && <p>Lade bestehende Einsatzorte...</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            {!loading && (
                <>
                    <label style={{ display: "block", marginBottom: "10px" }}>
                        <strong>Einsatzort auswählen:</strong>
                    </label>
                    <select
                        value={selectedOperationScene}
                        onChange={handleSelectChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px",
                        }}
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
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "10px" }}>
                                    <strong>Name des Einsatzorts:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={sceneData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "10px" }}>
                                    <strong>Beschreibung:</strong>
                                </label>
                                <textarea
                                    value={sceneData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                />
                            </div>

                            <button
                                onClick={onClickUpdateOperationScene}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: "#0047ab",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginBottom: "20px",
                                }}
                            >
                                Einsatzort aktualisieren
                            </button>
                        </>
                    )}

                    <button
                        onClick={onClickCreateOperationScene}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#0047ab",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Neuen Einsatzort erstellen
                    </button>
                </>
            )}
        </div>
    );
}
