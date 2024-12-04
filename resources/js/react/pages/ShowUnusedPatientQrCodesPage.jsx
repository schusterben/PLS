import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * Component for displaying and generating unused patient QR codes.
 */
export default function ShowUnusedPatientQrCodesPage() {
    const { adminToken } = useStateContext();
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Fetches unused patient QR codes from the API.
     */
    useEffect(() => {
        const fetchQRCodes = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, [adminToken]);

    /**
     * Generates a PDF document containing patient QR codes.
     */
    const generatePatientQRCodesPDF = () => {
        const doc = new jsPDF();

        qrCodes.forEach((code, index) => {
            if (index !== 0) doc.addPage();
            const qrCodeDataURL = document.getElementById(`qrcode-${index}`).toDataURL("image/png");
            doc.text(`Patient QR Code #${index + 1}`, 20, 20);
            doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
        });

        doc.save("patient_qrcodes.pdf");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Folgende QR-Codes wurden bis jetzt noch bei keinem Patienten verwendet</h2>
            {loading ? (
                <p>QR Codes werden geladen...</p>
            ) : (
                <>
                    <button
                        onClick={generatePatientQRCodesPDF}
                        style={{
                            marginBottom: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#0047ab",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Als PDF drucken
                    </button>
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
                </>
            )}
        </div>
    );
}
