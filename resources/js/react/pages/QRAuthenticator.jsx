import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

export default function QrAuthenticator() {
    const [cameraBlocked, setCameraBlocked] = useState(false);
    const [accessGranted, setaccessGranted] = useState(false);
    const { token, setToken } = useStateContext();

    const navigate = useNavigate();
    let scanner;

    const csrfToken = document.getElementById("root").getAttribute("data-csrf");

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        onScanSuccess(decodedText, decodedResult);
    };

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

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            scanner.stop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    function onAdminClick() {
        navigate("/AdminLandingPage");
    }

    function onScanSuccess(decodedText, decodedResult) {
        fetch("/api/qr-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify({ qr_code: decodedText }), // Send the decoded QR code
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Hier kannst du auf die Antwort von Laravel reagieren
                if (data.status.toLowerCase() === "success") {
                    if (data.token) {
                        setToken(data.token);
                    } else {
                        console.error("Authentication failed");
                    }
                    scanner.stop();
                    setaccessGranted(true);
                } else {
                    // Authentifizierung fehlgeschlagen
                    console.error("Ungültiger QR-Code");
                }
            })
            .catch((error) => console.error("Fetch error:", error));
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
