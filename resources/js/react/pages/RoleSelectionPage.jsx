import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

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

    const handleOptionChange = (event) => {
        const selectedId = event.target.value;
        setSelectedOperationScene(selectedId);
    };

    const handleRoleChange = (item) => {
        setSelectedRole(item.target.value);
    };

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
                navigate("/SituationRoomTable");
                break;
            default:
                navigate("/NotFound");
                break;
        }
    };

    useEffect(() => {
        const fetchExistingScenes = async () => {
            try {
                const response = await fetch(
                    "/api/getAllCurrentOperationScenes",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
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

    return (
        <div>
            {loading ? (
                <p>Lade bestehende Einsatzorte...</p>
            ) : (
                <div>
                    <h3>Willkommen bei der Rolenauswahl</h3>
                    <h4>Sie sind im Einsatz für</h4>
                    {/* TODO: Load Operations from DB */}
                    <select
                        value={selectedOperationScene}
                        onChange={handleOptionChange}
                        style={{ textAlign: "center" }}
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
                    <p>in Funktion als</p>
                    <select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        style={{ textAlign: "center" }}
                    >
                        <option value="">Rolle auswählen</option>
                        <option value="Triage">Triage</option>
                        <option value="Leitstelle">Leitstelle</option>
                    </select>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            position: "absolute",
                            bottom: "50px",
                            left: "0",
                            width: "100%",
                            textAlign: "center",
                            padding: "0",
                        }}
                    >
                        <button type="submit">Bestätigen</button>
                    </form>
                </div>
            )}
        </div>
    );
}
