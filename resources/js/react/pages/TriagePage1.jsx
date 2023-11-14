import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TriagePage1() {
    const navigate = useNavigate();
    const [green, setGreen] = useState(false);
    const [black, setBlack] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null); //  ID des ausgewählten Patienten wird gespeichert
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation((prevState) => ({
                ...prevState,
                loaded: true,
                error: {
                    message: "Geolocation is not supported by your browser",
                },
            }));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        loaded: true,
                        coordinates: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        error: null,
                    });
                },
                (error) => {
                    setLocation((prevState) => ({
                        ...prevState,
                        loaded: true,
                        error: error,
                    }));
                }
            );
        }
    }, []);

    const updateTriageColor = async (color) => {
        try {
            if (!location.loaded || location.error) {
                console.error("Koordinaten sind nicht verfügbar.");
                return;
            }

            const { lat, lng } = location.coordinates;
            console.log("Patienten ID: ", selectedPatientId);
            //const response = await axios.post(`/api/persons/${selectedPatientId}/update-triage-color`, {
            const response = await axios.post(
                "/api/persons/15/update-triage-color",
                {
                    triageColor: color,
                    lat: lat,
                    lng: lng,
                }
            );
            console.log(response.data.message);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Triagefarbe:", error);
        }
    };

    const handleGreen = () => {
        setGreen(true);
        updateTriageColor("grün");
    };

    const handleBlack = () => {
        setBlack(true);
        updateTriageColor("schwarz");
    };

    const handleNextPage = () => {
        navigate("/TriagePage2");
    };
    const handleNewPatient = () => {
        navigate("/ScanPatient");
    };

    const handleBodyClick = () => {
        navigate("/ShowBodyFront");
    };

    handleBodyClick;

    function renderContent() {
        if (!black && !green) {
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
                        Patient:In
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
                            <button onClick={handleGreen}>
                                Patient gehfähig (ohne weitere Verletzungen)
                            </button>
                            <button onClick={handleNextPage}>
                                Patient nicht gehfähig (und/oder weitere
                                Verletzungen)
                            </button>
                        </div>
                        <button
                            onClick={handleBlack}
                            style={{
                                width: "90%", // Der Button nimmt die volle Breite des umgebenden <div> ein
                                height: "5rem", // Höhe des Buttons (kann angepasst werden)
                            }}
                        >
                            eindeutiges Todeszeichen
                        </button>
                    </div>
                    <div
                        style={{
                            justifyContent: "space-between",
                            gap: "10px",
                            marginTop: "50px",
                        }}
                    ></div>
                </div>
            );
        } else if (green) {
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
                        Patient:In
                    </p>
                    <p
                        style={{
                            border: "2px solid green", // 2 Pixel breiter Rahmen in Schwarz
                            padding: "2%", // Innenabstand
                            display: "inline-block",
                            color: "green",
                        }}
                    >
                        Patient wurde mit der Kategorie GRÜN versehen
                    </p>
                    <button onClick={handleNewPatient}>
                        Nächsten Patienten laden
                    </button>
                </div>
            );
        } else if (black) {
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
                        Patient:In
                    </p>
                    <p
                        style={{
                            border: "2px solid #000", // 2 Pixel breiter Rahmen in Schwarz
                            margin: "5%", // Innenabstand
                            padding: "2%",
                            display: "inline-block",
                        }}
                    >
                        Patient wurde mit der Kategorie SCHWARZ versehen
                    </p>
                    <button onClick={handleNewPatient}>
                        Nächsten Patienten laden
                    </button>
                </div>
            );
        }
    }

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
            <h4>GPS Koordinaten:</h4>
            <p>Laden: {location.loaded ? "Erfolgreich" : "Lädt..."}</p>
            {location.loaded && !location.error && (
                <div>
                    <p>Breitengrad: {location.coordinates.lat}</p>
                    <p>Längengrad: {location.coordinates.lng}</p>
                </div>
            )}
            {location.error && (
                <div>
                    <p>Fehler: {location.error.message}</p>
                </div>
            )}
        </div>
    );
}
