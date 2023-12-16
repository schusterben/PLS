import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function EditOperationScene() {
    const navigate = useNavigate();
    const [sceneData, setSceneData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const { adminToken } = useStateContext();
    const [selectedOperationScene, setSelectedOperationScene] = useState("");
    const [existingOperationScenes, setExistingOperationScenes] = useState([]);

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchExistingScenes = async () => {
            try {
                const response = await fetch(
                    "/api/getAllCurrentOperationScenes",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${adminToken}`,
                        },
                    }
                );

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

    function onClickCreateOperationScene() {
        navigate("/CreateOperationScene");
    }

    async function onClickUpdateOperationScene() {
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

            if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
                navigate("/AdminLandingPage");
                return;
            }
            if (data.operactionScene) {
                setSuccessMessage("Einsatzort wurde erfolgreich aktualisiert");
                setSceneData({
                    name: "",
                    description: "",
                });
                setSelectedOperationScene("");
            }
            setLoading(true);
            const refreshedResponse = await fetch(
                "/api/getAllCurrentOperationScenes",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (!refreshedResponse.ok) {
                throw new Error("Network response was not ok");
            }

            const refreshedData = await refreshedResponse.json();
            if (
                refreshedData.error &&
                refreshedData.error.toUpperCase() === "UNAUTHORIZED"
            ) {
                navigate("/AdminLandingPage");
                return;
            }

            setExistingOperationScenes(refreshedData);
            setLoading(false); // Laden beendet
        } catch (error) {
            console.error("Einsatzort konnte nicht angelegt werden:", error);
        }
    }

    const handleSelectChange = (event) => {
        const selectedId = event.target.value;
        setSelectedOperationScene(selectedId);

        const selectedScene = existingOperationScenes.find(
            (scene) => scene.idoperationScene === parseInt(selectedId)
        );
        if (selectedScene) {
            setSceneData({
                name: selectedScene.name,
                description:
                    selectedScene.description == null
                        ? ""
                        : selectedScene.description,
            });
        } else {
            setSceneData({
                name: "",
                description: "",
            });
        }
    };

    return (
        <div>
            {loading ? (
                <p>Lade bestehende Einsatzorte...</p>
            ) : (
                <div>
                    <h1>Einsatzort bearbeiten</h1>
                    {successMessage && (
                        <p style={{ color: "green" }}>{successMessage}</p>
                    )}
                    <select
                        value={selectedOperationScene}
                        onChange={handleSelectChange}
                        style={{
                            width: 800,
                            height: 30,
                            margin: 20,
                            textAlign: "center",
                        }}
                    >
                        <option value="">Wähle einen Einsatzort aus</option>
                        {existingOperationScenes.map((scene) => (
                            <option
                                key={scene.idoperationScene}
                                value={scene.idoperationScene}
                            >
                                {scene.name}
                            </option>
                        ))}
                    </select>

                    {selectedOperationScene && (
                        <div>
                            <label>
                                Name des Einsatzorts:
                                <input
                                    type="text"
                                    name="name"
                                    value={sceneData.name}
                                    onChange={(e) =>
                                        setSceneData({
                                            ...sceneData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <br />
                            <label>
                                Beschreibung:
                                <br />
                                <textarea
                                    name="description"
                                    value={sceneData.description}
                                    onChange={(e) =>
                                        setSceneData({
                                            ...sceneData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    cols={105}
                                />
                            </label>
                            <button
                                onClick={onClickUpdateOperationScene}
                                style={{ width: "350px", margin: 10 }}
                            >
                                Einsatzort updaten
                            </button>
                        </div>
                    )}
                    <br />

                    <button
                        onClick={onClickCreateOperationScene}
                        style={{ width: "350px", margin: 50 }}
                    >
                        Neuen Einsatzort erstellen
                    </button>
                </div>
            )}
        </div>
    );
}
