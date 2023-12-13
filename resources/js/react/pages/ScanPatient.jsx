import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
//import { Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

export default function ScanPatient() {
    const location = useLocation();
    const [cameraBlocked, setCameraBlocked] = useState(false);
    const [accessGranted, setaccessGranted] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const { token, setToken } = useStateContext();
    const operationScene = location.state?.operationScene;
    const navigate = useNavigate();
    let scanner;

    useEffect(() => {
        if (!scanner?.getState()) {
            const config = { fps: 5, qrbox: { width: 200, height: 200 } };
            scanner = new Html5Qrcode("reader");

            scanner
                .start(
                    { facingMode: "environment" },
                    config,
                    qrCodeSuccessCallback
                )
                .catch((error) => {
                    setCameraBlocked(true);
                    console.warn(`Code scan error = ${error}`);
                });
        }
    }, []);

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        onScanSuccess(decodedText, decodedResult);
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            scanner.stop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    function onScanSuccess(decodedText, decodedResult) {
        fetch("/api/verify-patient-qr-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                qr_code: decodedText,
                operationScene: operationScene,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    if (
                        data.error &&
                        data.error.toUpperCase() === "UNAUTHORIZED"
                    ) {
                        navigate("/AdminLandingPage");
                        return;
                    }
                    throw new Error("Netzwerkantwort war nicht ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.patientId) {
                    scanner.stop();
                    setPatientId(data.patientId);
                    //setAccessGranted(true);
                    navigate("/TriagePage1", {
                        state: {
                            patientId: data.patientId,
                            operationScene: operationScene,
                        },
                    });
                } else {
                    console.error(
                        "Ungültiger QR-Code oder Fehler bei der Erstellung des Patienten"
                    );
                }
            })
            .catch((error) => {
                console.error("Fehler beim Senden des QR-Codes", error);
            });
    }

    return (
        <div>
            <h2>Bitte einen Patienten QR-Code scannen</h2>
            <div id="reader"></div>
            {cameraBlocked ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                    Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben
                    Sie den Zugriff auf die Kamera über die Einstellungen.
                </p>
            ) : (
                ""
            )}
        </div>
    );
}
