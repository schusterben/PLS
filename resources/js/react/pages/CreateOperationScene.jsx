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
                body: JSON.stringify({
                    name: sceneData.name,
                    description: sceneData.description,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
                navigate("/AdminLandingPage");
                return;
            }
            if (data.operactionScene) {
                setSuccessMessage("Einsatzort wurde erfolgreich erstellt");
                setSceneData({
                    name: "",
                    description: "",
                });
            }
        } catch (error) {
            console.error("Einsatzort konnte nicht angelegt werden:", error);
        }
    };

    return (
        <div>
            <h1>Neuen Einsatzort erstellen</h1>
            {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
            )}
            <label style={{ color: "white" }}>
                Der Einsatzort steht nach Erstellung 20 Tage in der Liste der
                Einsatzorte zur Auswahl
            </label>
            <form onSubmit={handleSubmit}>
                <label>
                    Name des Einsatzorts:
                    <input
                        type="text"
                        name="name"
                        value={sceneData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Beschreibung:
                    <br />
                    <textarea
                        name="description"
                        value={sceneData.description}
                        onChange={handleInputChange}
                        rows={4}
                        cols={100}
                    />
                </label>
                <br />

                <button type="submit">Einsatzort erstellen</button>
            </form>
        </div>
    );
}
