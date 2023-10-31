import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TriagePage2() {
    const navigate = useNavigate();

    const [red, setRed] = useState(false);

    const handleRed = () => {
        //TODO: fetch category red to Server
        setRed(true);
    };

    const handleNextPage = () => {
        navigate("/TriagePage3");
    };
    const handleNewPatient = () => {
        navigate("/ScanPatient");
    };

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
                        Patient:In <br /> nicht gehfähig
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
                        Patient:In <br /> nicht gehfähig
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
