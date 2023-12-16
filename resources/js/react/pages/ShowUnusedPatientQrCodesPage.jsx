import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

/**
 * Component for displaying and generating unused patient QR codes.
 */
export default function ShowUnusedPatientQrCodesPage() {
    // Access the admin token from the global state
    const { adminToken } = useStateContext();
    const navigate = useNavigate();
    const [qrCodes, setQRCodes] = useState([]);

    /**
     * Fetches unused patient QR codes from the API.
     */
    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const response = await fetch("/api/getUnusedPatientQrCodes", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                setQRCodes(data);
            } catch (error) {
                console.error("Error fetching QR codes:", error);
            }
        };

        fetchQRCodes();
    }, [adminToken, navigate]);

    /**
     * Generates a PDF document containing patient QR codes.
     */
    async function generatePatientQRCodes() {
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

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h2>
                Folgende QR-Codes wurden bis jetzt noch bei keinem Patienten
                verwendet
            </h2>
            <button onClick={generatePatientQRCodes}>Als PDF drucken</button>
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
