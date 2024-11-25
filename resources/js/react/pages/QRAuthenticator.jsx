import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * QrAuthenticator component for authenticating users using QR codes.
 */
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

    // This effect is used to initialize and start the QR code scanner when the component mounts.
    useEffect(() => {
        if (!scanner?.getState()) {
            const config = { fps: 5, qrbox: { width: 150, height: 150 } };
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

    /**
     * Handle the click event for the "Anmelden als Admin" button.
     * Navigates to the admin landing page.
     */
    const handleAdminLogin = () => {
        navigate("/AdminLandingPage");
    };

    /**
     * Handle the successful QR code scan result.
     * Sends the decoded QR code to the server for authentication.
     * @param {string} decodedText - The decoded QR code text.
     * @param {object} decodedResult - The decoded QR code result.
     */
    const onScanSuccess = (decodedText, decodedResult) => {
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
                if (data.status.toLowerCase() === "success" && data.token) {
                    setToken(data.token);
                    scanner.stop();
                    setaccessGranted(true);
                } else {
                        console.error("Ungültiger QR-Code");
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    };

    return (
        <div className={"container"}>
            <h1 style = {{ marginBottom: "10px", textAlign: "center" }}>
                Willkommen im PLS-System
            </h1>
            <p style = {{ marginBottom: "20px", textAlign: "center" }}>
                <h2>Hinweis:</h2>
                <strong>Admin:</strong> Erstellen Sie zunächst einen Einsatzort und generieren Sie bei Bedarf QR-Codes
                für die Authorisierung der Einsatzkräfte und Patienten.
                <br/>
                <button
                    onClick={handleAdminLogin}
                    className="admin-button"
                    title="Admins erstellen zuerst einen Einsatzort und bei Bedarf QR-Codes für Einsatzkräfte und Patienten."
                >
                    Adminanmeldung
                </button>
                <br/>
                <br/>
                <strong>Einsatzkräfte:</strong> Nutzen Sie Ihren QR-Code für die Anmeldung.
            </p>
            <div className="actions">

                <div
                    id="reader"
                    title="Scannen Sie Ihren QR-Code, um sich als Einsatzkraft zu registrieren."
                ></div>
            </div>

            {cameraBlocked && (
                <p style={{color: "red", fontWeight: "bold" }}>
                    Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben
                    Sie den Zugriff auf die Kamera über die Einstellungen.
                </p>
            )}
            {accessGranted && <Navigate to="/RoleSelection" />}
        </div>
    );
}
