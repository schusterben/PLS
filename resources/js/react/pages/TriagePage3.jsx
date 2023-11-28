import { useNavigate, useLocation  } from "react-router-dom";
import { useState, useEffect  } from "react";

export default function TriagePage3() {
    const navigate = useNavigate();
    const location = useLocation();
    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);
    const patientId = location.state?.patientId;
    const [position, setPosition] = useState({
        loaded: false,
        coordinates: { lat: '', lng: '' },
        error: null
    });
    // const [additionalInfo, setAdditionalINfo] = useState[{
    //     zusatzInfo1: '',
    //     zusatzInfo2: '',
    //     //hier können noch weitere Informationen mit übergeben werden
    // }]

    useEffect(() => {
        let isMounted = true;

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

        return () => {
            isMounted = false;
        };
    }, []);

    const updateTriageColor = async (color) => {
        if (!patientId) {
            console.error("Keine Patienten-ID verfügbar");
            return;
        }

        if (!position.loaded || position.error) {
            console.error('Koordinaten sind nicht verfügbar.');
            return;
        }

        // entfernen: const { lat, lng } = position.coordinates;

        const requestBody = {
            triageColor: color,
            lat: position.coordinates.lat,
            lng: position.coordinates.lng,
            //...additionalInfo
        };

        try {
            const response = await fetch(`/api/persons/${patientId}/update-triage-color`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("Serverantwort war nicht ok");
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Triagefarbe:', error);
        }
    };

    const handleRed = () => {
        setRed(true);
        updateTriageColor('rot')
    };
    const handleYellow = () => {
        //TODO: fetch category red to Server
        setYellow(true);
        updateTriageColor('gelb')
    };

    const handleNewPatient = () => {
        navigate("/ScanPatient");
    };

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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br /> Atmung
                        suffizient
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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br /> Atmung
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
                        Patient:In ID: {patientId} <br /> nicht gehfähig <br /> Atmung
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
    const handleBodyClick = () => {
        navigate("/ShowBody");
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
