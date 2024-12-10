import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";

export default function ShowUnusedLoginQrCodesPage() {
    const { adminToken } = useStateContext();
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQRCodes = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/getLoginQrCodes", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
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

    const generateLoginQRCodesPDF = () => {
        const doc = new jsPDF();
        qrCodes.forEach((code, index) => {
            if (index !== 0) doc.addPage();
            const qrCodeDataURL = document.getElementById(`qrcode-${index}`).toDataURL();
            doc.text(`Login QR-Code #${index + 1}`, 20, 20);
            doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
        });
        doc.save("qrcodes.pdf");
    };

    return (
        <div style={{ textAlign: "center", padding: "10px" }}>
            <h2 style={{ marginBottom: "5px" }}>Folgende QR-Codes können zum Authorisieren verwendet werden</h2>
            {loading ? (
                <p>QR Codes werden geladen...</p>
            ) : (
                <>
                    <button onClick={generateLoginQRCodesPDF}>Als PDF drucken</button>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "20px",
                            marginTop: "10px",
                        }}
                    >
                        {qrCodes.map((code, index) => (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    textAlign: "center",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <QRCode id={`qrcode-${index}`} value={code} size={150} />
                                <p>Authorisierungs QR-Code #{index + 1}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
