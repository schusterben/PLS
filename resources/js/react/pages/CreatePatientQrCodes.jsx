import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * Component for generating and printing patient QR codes.
 */
export default function CreatePatientQrCodes() {
    const { adminToken } = useStateContext();
    const [requestedQrCount, setRequestedQrCount] = useState(0);
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handle changes in the input field for the requested QR code count.
     * @param {Object} event - The input change event.
     */
    const handleRequestedQrCountChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value >= 0) {
            setRequestedQrCount(value);
            setErrorMessage("");
        } else {
            setErrorMessage("Bitte geben Sie eine gültige Anzahl ein.");
        }
    };

    useEffect(() => {
        if (requestedQrCount > 0 && loading) {
            const fetchQRCodes = async () => {
                try {
                    const response = await fetch("/api/generatePatientQRCodes", {
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

                    if (data.qrcodes && Array.isArray(data.qrcodes)) {
                        setQRCodes(data.qrcodes);
                    }
                } catch (error) {
                    setErrorMessage(
                        "Es gab einen Fehler bei der Erstellung der QR-Codes. Bitte versuchen Sie es erneut."
                    );
                } finally {
                    setLoading(false);
                }
            };

            fetchQRCodes();
        }
    }, [loading, adminToken, requestedQrCount]);

    /**
     * Generate a PDF containing the patient QR codes.
     */
    const printQrCodesToPDF = () => {
        const doc = new jsPDF();

        qrCodes.forEach((code, index) => {
            if (index !== 0) doc.addPage();
            const qrCodeDataURL = document.getElementById(`qrcode-${index}`).toDataURL("image/png");
            doc.text(`Patient QR Code #${index + 1}`, 20, 20);
            doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
        });

        doc.save("patient_qrcodes.pdf");
    };

    /**
     * Handle the button click to generate patient QR codes.
     */
    const generatePatientQRCodes = () => {
        if (requestedQrCount > 0) {
            setLoading(true);
            setQRCodes([]);
        } else {
            setErrorMessage("Bitte geben Sie eine gültige Anzahl ein.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Patienten QR-Codes generieren</h2>
            <p>Bitte auswählen, wie viele Patienten QR-Codes generiert werden sollen</p>

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
                onClick={generatePatientQRCodes}
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
                        <p style={{ marginTop: "10px" }}>QR Code #{index + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
