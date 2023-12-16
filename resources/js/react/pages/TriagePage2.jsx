import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * Component for the second page of patient triage in an emergency situation.
 */
export default function TriagePage2() {
    const { token, setToken } = useStateContext();
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

    /**
     * Fetches the user's geolocation coordinates.
     */
    useEffect(() => {
        let isMounted = true;

        if (!navigator.geolocation) {
            if (isMounted) {
                setPosition((prevState) => ({
                    ...prevState,
                    loaded: true,
                    error: {
                        message: "Geolocation is not supported by your browser",
                    },
                }));
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (isMounted) {
                        setPosition({
                            loaded: true,
                            coordinates: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            },
                            error: null,
                        });
                    }
                },
                (error) => {
                    if (isMounted) {
                        setPosition((prevState) => ({
                            ...prevState,
                            loaded: true,
                            error: error,
                        }));
                    }
                }
            );
        }

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Updates the triage color of the patient and sends the update to the server.
     * @param {string} color - The triage color to update.
     */
    const updateTriageColor = async (color) => {
        if (!patientId) {
            console.error("Keine Patienten-ID verfügbar");
            return;
        }

        if (!position.loaded || position.error) {
            console.error("Koordinaten sind nicht verfügbar.");
            return;
        }

        // entfernen: const { lat, lng } = position.coordinates;

        const requestBody = {
            triageColor: color,
            lat: position.coordinates.lat,
            lng: position.coordinates.lng,
            respiration: false,
        };

        try {
            const response = await fetch(
                `/api/persons/${patientId}/update-triage-color`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error("Serverantwort war nicht ok");
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Triagefarbe:", error);
        }
    };

    /**
     * Handles the "red" triage button click.
     */
    const handleRed = () => {
        setRed(true);
        updateTriageColor("rot");
    };

    /**
     * Handles the "Next Page" button click and updates patient respiration status.
     */
    const handleNextPage = async () => {
        const requestBody = {
            lat: position.coordinates.lat,
            lng: position.coordinates.lng,
            respiration: true,
        };

        try {
            const response = await fetch(
                `/api/persons/${patientId}/respiration`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error("Serverantwort war nicht ok");
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Atmung:", error);
        }

        navigate("/TriagePage3", {
            state: { patientId: patientId, operationScene: operationScene },
        });
    };

    /**
     * Handles the "New Patient" button click.
     */
    const handleNewPatient = () => {
        navigate("/ScanPatient", {
            state: {
                operationScene: operationScene,
            },
        });
    };

    /**
     * Renders the content based on the selected triage color.
     * @returns {JSX.Element} - The rendered content.
     */
    function renderContent() {
        if (!red) {
            return (
                <div>
                    <p
                        style={{
                            position: "absolute",
                            top: "13%",
                            left: "0",
                            width: "100%",
                            textAlign: "center",
                            padding: "0",
                        }}
                    >
                        Patient:In ID: {patientId} <br /> nicht gehfähig
                    </p>
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "4%",
                                padding: "5%",
                                marginBottom: "15%",
                            }}
                        >
                            <button onClick={handleNextPage}>
                                Atmung suffizient
                            </button>
                            <button onClick={handleRed}>
                                Atmung nicht suffizient
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (red) {
            return (
                <div>
                    <p
                        style={{
                            position: "absolute",
                            top: "13%",
                            left: "0",
                            width: "100%",
                            textAlign: "center",
                            padding: "0",
                        }}
                    >
                        Patient:In ID: {patientId} <br /> nicht gehfähig
                    </p>
                    <p
                        style={{
                            border: "2px solid red", // 2 Pixel breiter Rahmen in Schwarz
                            margin: "5%", // Innenabstand
                            padding: "2%",
                            display: "inline-block",
                            color: "red",
                        }}
                    >
                        Patient wurde mit der Kategorie ROT versehen
                    </p>
                    <button onClick={handleNewPatient}>
                        Nächsten Patienten laden
                    </button>
                </div>
            );
        }
    }

    /**
     * Handles the "Body Click" button click.
     */
    const handleBodyClick = () => {
        navigate("/ShowBodyFront", {
            state: {
                patientId: patientId,
            },
        });
    };

    return (
        <div>
            {renderContent()}
            <button
                style={{
                    position: "absolute",
                    bottom: "5%",
                    right: "5%",

                    textAlign: "center",
                    padding: "0",
                    fontSize: "2rem",
                }}
                onClick={handleBodyClick}
            >
                👤
            </button>
        </div>
    );
}
