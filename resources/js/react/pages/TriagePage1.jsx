import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TriagePage1() {
    const navigate = useNavigate();
    const [green, setGreen] = useState(false);
    const [black, setBlack] = useState(false);

    const handleGreen = () => {
        //TODO: fetch category green to server
        setGreen(true);
    };

    const handleBlack = () => {
        //TODO: fetch category black to server

        setBlack(true);
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
        </div>
    );
}
