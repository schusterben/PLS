import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * Component for creating a new operation scene.
 */
export default function CreateOperationScene() {
    const [sceneData, setSceneData] = useState({
        name: "",
        description: "",
    });
    const { adminToken } = useStateContext();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handle changes in the input fields.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSceneData({ ...sceneData, [name]: value });
    };

    /**
     * Handle form submission to create a new operation scene.
     * @param {Object} event - The form submit event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/createOperationScene", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(sceneData),
            });

            if (!response.ok) {
                throw new Error("Fehler beim Senden der Anfrage.");
            }

            const data = await response.json();

            if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
                setErrorMessage("Nicht autorisiert. Bitte melden Sie sich erneut an.");
                return;
            }

            if (data.operactionScene) {
                setSuccessMessage("Einsatzort wurde erfolgreich erstellt.");
                setSceneData({
                    name: "",
                    description: "",
                });
            }
        } catch (error) {
            setErrorMessage(
                "Einsatzort konnte nicht angelegt werden. Bitte versuchen Sie es erneut."
            );
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
            <h1>Neuen Einsatzort erstellen</h1>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <p style={{ marginBottom: "20px" }}>
                Der Einsatzort steht nach Erstellung 20 Tage in der Liste der Einsatzorte zur Auswahl.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    <strong>Name des Einsatzorts:</strong>
                    <input
                        type="text"
                        name="name"
                        value={sceneData.name}
                        onChange={handleInputChange}
                        placeholder="Name des Einsatzorts eingeben"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        required
                    />
                </label>

                <label style={{ display: "block", marginBottom: "20px" }}>
                    <strong>Beschreibung:</strong>
                    <textarea
                        name="description"
                        value={sceneData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Beschreibung des Einsatzorts eingeben"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        required
                    />
                </label>

                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#0047ab",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Einsatzort erstellen
                </button>
            </form>
        </div>
    );
}
