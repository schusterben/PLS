import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TriagePage1() {
    const navigate = useNavigate();
    const routerLocation = useLocation();       //Position Router
    const location = useLocation(); // Verwenden von useLocation, um auf den Navigationszustand zuzugreifen
    const [green, setGreen] = useState(false);
    const [black, setBlack] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null); //  ID des ausgewählten Patienten wird gespeichert
    const [position, setPosition] = useState({  //GPS Position Gerät
        loaded: false,
        coordinates: { lat: '', lng: '' },
        error: null
    });
    const patientId = location.state?.patientId;

    useEffect(() => {
        let isMounted = true;  // Flag zum Überprüfen, ob die Komponente noch eingehängt ist

        // Abrufen der Patienten-ID aus dem Navigationszustand    
        if (position.state && position.state.patientId) {
        setSelectedPatientId(position.state.patientId);
    }
        //Geolokalisierung


        const getGeolocation = () => {
            if (!navigator.geolocation) {
                if (isMounted) {
                    setPosition(prevState => ({
                        ...prevState,
                        loaded: true,
                        error: { message: "Geolocation is not supported by your browser" }
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
                                error: null
                            });
                        }
                    },
                    (error) => {
                        if (isMounted) {
                            setPosition(prevState => ({
                                ...prevState,
                                loaded: true,
                                error: error
                            }));
                        }
                    }
                );
            }
        };

        getGeolocation();

        // Bereinigungsfunktion
        return () => {
            isMounted = false;
        };
    }, []); // Abhängigkeiten-Array ist leer, wird also nur beim ersten Rendern ausgeführt

    const updateTriageColor = async (color) => {
        if(!{patientId}) {
            console.error("Keine Patienten-ID verfügbar");
            return;
        }
        try {
            if (!position.loaded || position.error) {
                console.error('Koordinaten sind nicht verfügbar.');
                return;
            }

            const { lat, lng } = position.coordinates;
            console.log("Patienten ID: ", {patientId});
            const response = await axios.post("/api/persons/${patientId}/update-triage-color", {
            //const response = await axios.post("/api/persons/25/update-triage-color", {
                triageColor: color,
                lat: lat,
                lng: lng
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Triagefarbe:', error);
        }
    };

    const handleGreen = () => {
        setGreen(true);
        updateTriageColor('grün');
    };

    const handleBlack = () => {

        setBlack(true);
        updateTriageColor('schwarz');
    };

    const handleNextPage = () => {
        navigate("/TriagePage2");
    };
    const handleNewPatient = () => {
        navigate("/ScanPatient");
    };

    const handleBodyClick = () => {
        navigate("/ShowBody");
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
                        Patient:In ID: {patientId}
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
                        Patient:In ID: {patientId}
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
                        Patient:In ID: {patientId}
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
            <p>Laden: {position.loaded ? 'Erfolgreich' : 'Lädt...'}</p>
            {position.loaded && !position.error && (
                <div>
                    <p>Breitengrad: {position.coordinates.lat}</p>
                    <p>Längengrad: {position.coordinates.lng}</p>
                </div>
            )}
            {routerLocation.error && (
                <div>
                    <p>Fehler: {position.error.message}</p>
                </div>
            )}
        </div>
    );   
}
