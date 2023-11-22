import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function ShowUnusedQrCodesPage() {
    const { adminToken } = useStateContext();
    const navigate = useNavigate();
    const [qrCodes, setQRCodes] = useState([]);

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const response = await fetch("/api/qrCodePatientExists", {
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

    async function generateQrCodes() {
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
        <div>
            <button onClick={generateQrCodes}>Als PDF drucken</button>
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
