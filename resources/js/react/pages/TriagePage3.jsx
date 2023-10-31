import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TriagePage3() {
    const navigate = useNavigate();

    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);

    const handleRed = () => {
        //TODO: fetch category red to Server
        setRed(true);
    };
    const handleYellow = () => {
        //TODO: fetch category red to Server
        setYellow(true);
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
                        Patient:In <br /> nicht gehfähig <br /> Atmung
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
                        Patient:In <br /> nicht gehfähig <br /> Atmung
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
                        Patient:In <br /> nicht gehfähig <br /> Atmung
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
