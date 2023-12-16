import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

/**
 * Component for generating and printing patient QR codes.
 */
export default function CreatePatientQrCodes() {
    const { adminToken } = useStateContext();
    const [requestedQrCount, setRequestedQrCount] = useState(0);
    const [qrCodes, setQRCodes] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const navigate = useNavigate();

    /**
     * Handle changes in the input field for the requested QR code count.
     * @param {Object} event - The input change event.
     */
    function handleRequestedQrCountChange(event) {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            setRequestedQrCount(event.target.value);
        }
    }

    useEffect(() => {
        // This useEffect hook is responsible for fetching patient QR codes when the "generatePatientQRCodes" button is clicked.
        // It also handles printing the generated QR codes to a PDF.

        // Check if the requested QR code count is greater than 0 and the button is clicked.
        if (requestedQrCount > 0 && buttonClicked) {
            const fetchQRCodes = async () => {
                try {
                    const response = await fetch(
                        "/api/generatePatientQRCodes",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${adminToken}`,
                            },
                            body: JSON.stringify({ number: requestedQrCount }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const data = await response.json();

                    if (
                        data.error &&
                        data.error.toUpperCase() === "UNAUTHORIZED"
                    ) {
                        // If the admin is unauthorized, navigate to the AdminLandingPage.
                        navigate("/AdminLandingPage");
                        return;
                    }

                    if (data.qrcodes && Array.isArray(data.qrcodes)) {
                        // If QR codes are successfully generated, set them in the state.
                        setQRCodes(data.qrcodes);
                    }
                } catch (error) {
                    console.error("Error fetching QR codes:", error);
                }
            };

            // Call the fetchQRCodes function to initiate the QR code generation.
            fetchQRCodes();

            // Reset the buttonClicked state to prevent unnecessary fetch calls.
            setButtonClicked(false);
        }
    }, [buttonClicked, adminToken, navigate, requestedQrCount]);

    /**
     * Generate a PDF containing the patient QR codes.
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

            const qrCodeDataURL = element.toDataURL("image/png");
            doc.addImage(qrCodeDataURL, "PNG", x, y, size, size);
        });

        doc.save("qrcode_pdf.pdf");
    }

    /**
     * Handle the button click to generate patient QR codes.
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
            <h2>Patienten QR-Codes generieren</h2>
            <p>
                Bitte auswählen, wie viele Patienten QR-Codes generiert werden
                sollen
            </p>
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
