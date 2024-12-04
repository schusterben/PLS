import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

/**
 * Component for creating and printing login QR codes.
 */
export default function CreateLoginQrCodesPage() {
    const { adminToken } = useStateContext();
    const [requestedQrCount, setRequestedQrCount] = useState(0);
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    /**
     * Handle changes in the requested QR code count input.
     * @param {Object} event - The input change event.
     */
    const handleRequestedQrCountChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value >= 0) {
            setRequestedQrCount(value);
        } else {
            setErrorMessage("Bitte geben Sie eine gültige Anzahl ein.");
        }
    };

    useEffect(() => {
        if (requestedQrCount > 0 && loading) {
            const fetchQRCodes = async () => {
                try {
                    setErrorMessage(""); // Clear any existing error messages
                    const response = await fetch("/api/generateLoginQRCodes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({ number: requestedQrCount }),
                    });

                    if (!response.ok) {
                        throw new Error("Fehler beim Abrufen der Daten.");
                    }

                    const data = await response.json();

                    if (
                        data.error &&
                        data.error.toUpperCase() === "UNAUTHORIZED"
                    ) {
                        navigate("/AdminLandingPage");
                        return;
                    }

                    if (data.qrcodes && Array.isArray(data.qrcodes)) {
                        setQRCodes(data.qrcodes);
                    }
                } catch (error) {
                    setErrorMessage(
                        "Es gab einen Fehler bei der Erstellung der QR-Codes. Bitte versuchen Sie es erneut."
                    );
                } finally {
                    setLoading(false); // Stop loading spinner
                }
            };

            fetchQRCodes();
        }
    }, [loading, adminToken, navigate, requestedQrCount]);

    /**
     * Create and save QR codes as a PDF.
     */
    const printQrCodesToPDF = () => {
        const doc = new jsPDF();

        qrCodes.forEach((code, index) => {
            if (index !== 0) doc.addPage();
            const qrCodeDataURL = document.getElementById(`qrcode-${index}`).toDataURL("image/png");
            doc.text(`Login QR Code #${index + 1}`, 20, 20);
            doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
        });

        doc.save("login_qrcodes.pdf");
    };

    /**
     * Handle the click event to generate login QR codes.
     */
    const generateLoginQRCodes = () => {
        if (requestedQrCount > 0) {
            setLoading(true); // Start loading spinner
            setQRCodes([]); // Clear previous QR codes
        } else {
            setErrorMessage("Bitte geben Sie eine gültige Anzahl ein.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>QR-Codes für die Authentifizierung generieren</h2>
            <p>Wählen Sie die Anzahl der zu generierenden QR-Codes aus.</p>

            <input
                style={{
                    width: "300px",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
                type="number"
                id="requestedQrCountInput"
                value={requestedQrCount}
                onChange={handleRequestedQrCountChange}
                placeholder="Anzahl eingeben"
            />
            <br />

            <button
                onClick={generateLoginQRCodes}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#0047ab",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                QR-Codes generieren
            </button>

            <button
                onClick={printQrCodesToPDF}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#0047ab",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                disabled={qrCodes.length === 0}
            >
                Als PDF drucken
            </button>

            {loading && <p style={{ color: "#0047ab" }}>QR-Codes werden generiert...</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {qrCodes.map((code, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "#f9f9f9",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            textAlign: "center",
                        }}
                    >
                        <QRCode id={`qrcode-${index}`} value={code} size={150} />
                        <p>QR Code #{index + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
