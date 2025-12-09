import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";
import "./../../../css/ShowUnusedQrCodes.css";

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
            const qrCodeDataURL = document
                .getElementById(`qrcode-${index}`)
                .toDataURL();
            doc.text(`Login QR Code #${index + 1}`, 20, 20);
            doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
        });
        doc.save("login_qrcodes.pdf");
    };

    return (
        <div className="qr-show-page">
            <h2 className="qr-show-title">
                Folgende QR-Codes können zum Authentifizieren verwendet werden
            </h2>

            {loading ? (
                <p className="qr-status info">QR-Codes werden geladen...</p>
            ) : (
                <>
                    <div className="qr-actions">
                        <button
                            className="btn btn-primary"
                            onClick={generateLoginQRCodesPDF}
                            disabled={qrCodes.length === 0}
                        >
                            Als PDF drucken
                        </button>
                    </div>

                    <div className="qr-grid">
                        {qrCodes.map((code, index) => (
                            <div className="qr-card" key={index}>
                                <QRCode
                                    id={`qrcode-${index}`}
                                    value={code}
                                    size={150}
                                />
                                <p className="qr-caption">
                                    QR Code #{index + 1}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
