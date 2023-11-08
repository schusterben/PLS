import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function QrAuthenticator() {
    const [cameraBlocked, setCameraBlocked] = useState(false);
    const [accessGranted, setaccessGranted] = useState(false);
    const navigate = useNavigate();
    let scanner;
    useEffect(() => {
        function onScanSuccess(decodedText, decodedResult) {
            // TODO: here we should check the access in the DB
            if (decodedText.toUpperCase() === "HALLO MARKO") {
                scanner.stop();
                setaccessGranted(true);
            }
            console.log(`Code matched = ${decodedText}`, decodedResult);
        }

        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            onScanSuccess(decodedText, decodedResult);
        };

        function onScanError(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // for example:
            console.warn(`Code scan error = ${error}`);
        }

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
    });

    function onAdminClick() {
        navigate("/AdminLandingPage");
    }

    return (
        <div>
            <h2>Willkommen im PLS-System</h2>
            <h5>Bitte den QR-Code für die Anmeldung scannen</h5>
            <div id="reader"></div>
            {cameraBlocked ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                    Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben
                    Sie den Zugriff auf die Kamera über die Einstellungen.
                </p>
            ) : (
                ""
            )}
            {accessGranted && <Navigate to="/RoleSelection" />}
            <br />
            <button onClick={onAdminClick}>Anmelden als Admin</button>
        </div>
    );
}
