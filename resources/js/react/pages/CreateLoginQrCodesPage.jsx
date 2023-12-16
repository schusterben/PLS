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
    const [buttonClicked, setButtonClicked] = useState(false);
    const navigate = useNavigate();

    /**
     * Handle changes in the requested QR code count input.
     * @param {Object} event - The input change event.
     */
    function handleRequestedQrCountChange(event) {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            setRequestedQrCount(event.target.value);
        }
    }

    useEffect(() => {
        if (requestedQrCount > 0 && buttonClicked) {
            const fetchQRCodes = async () => {
                try {
                    const response = await fetch("/api/generateLoginQRCodes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({ number: requestedQrCount }),
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
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
                    console.error("Error fetching QR codes:", error);
                }
            };

            fetchQRCodes();
            setButtonClicked(false);
        }
    }, [buttonClicked, adminToken, navigate, requestedQrCount]);

    /**
     * Create and save QR codes as a PDF.
     */
    async function printQrCodesToPDF() {
        const x = 50;
        const y = 50;
        const size = 100;
        const doc = new jsPDF();

        const qrCodeElements = document.querySelectorAll("[id^='qrcode-']");

        qrCodeElements.forEach((element, index) => {
            if (index !== 0) {
                doc.addPage();
            }
            doc.setFontSize(25);
            doc.text("Login", x + 40, y - 10);
            const qrCodeDataURL = element.toDataURL("image/png");
            doc.addImage(qrCodeDataURL, "PNG", x, y, size, size);
        });

        doc.save("qrcode_pdf.pdf");
    }

    /**
     * Handle the click event to generate patient QR codes.
     */
    function generatePatientQRCodes() {
        setButtonClicked(true);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h2>QR-Codes für die Authentifizierung generieren</h2>
            <p>Bitte auswählen, wie viele QR-Codes generiert werden sollen</p>
            <input
                style={{ width: "300px" }}
                type="number"
                id="requestedQrCountInput"
                value={requestedQrCount}
                onChange={handleRequestedQrCountChange}
                placeholder="Bitte hier die Anzahl eingeben"
            />
            <button onClick={generatePatientQRCodes}>
                QR-Codes generieren
            </button>
            <button onClick={printQrCodesToPDF}>Als PDF drucken</button>

            <div>
                {qrCodes.map((code, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "#ffffff",
                            padding: "10px",
                            marginBottom: "10px",
                            marginTop: "10px",
                            width: "100%",
                        }}
                    >
                        <QRCode id={`qrcode-${index}`} value={code} />
                    </div>
                ))}
            </div>
        </div>
    );
}
