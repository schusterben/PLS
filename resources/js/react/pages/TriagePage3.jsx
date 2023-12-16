import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * Component for the third page of patient triage in an emergency situation.
 */
export default function TriagePage3() {
    const { token, setToken } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);
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

        var requestBody;
        switch (color) {
            case "rot":
                requestBody = {
                    triageColor: color,
                    lat: position.coordinates.lat,
                    lng: position.coordinates.lng,
                    bloodStopable: false,
                };
                break;
            case "gelb":
                requestBody = {
                    triageColor: color,
                    lat: position.coordinates.lat,
                    lng: position.coordinates.lng,
                    bloodStopable: true,
                };
                break;
            default:
                requestBody = {
                    triageColor: color,
                    lat: position.coordinates.lat,
                    lng: position.coordinates.lng,
                    //...additionalInfo
                };
        }

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
     * Handles the "yellow" triage button click.
     */
    const handleYellow = () => {
        //TODO: fetch category red to Server
        setYellow(true);
        updateTriageColor("gelb");
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
        if (!red && !yellow) {
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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br />{" "}
                        Atmung suffizient
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
                            <button onClick={handleYellow}>
                                Blutung Stillbar
                            </button>
                            <button onClick={handleRed}>
                                Blutung nicht stillbar
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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br />{" "}
                        Atmung
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
        } else if (yellow) {
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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br />{" "}
                        Atmung
                    </p>
                    <p
                        style={{
                            border: "2px solid yellow", // 2 Pixel breiter Rahmen in Schwarz
                            margin: "5%", // Innenabstand
                            padding: "2%",
                            display: "inline-block",
                            color: "yellow",
                        }}
                    >
                        Patient wurde mit der Kategorie Gelb versehen
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
