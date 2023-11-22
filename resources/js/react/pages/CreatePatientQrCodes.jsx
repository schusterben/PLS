import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function CreatePatientQrCodes() {
    const { adminToken } = useStateContext();
    const [number, setNumber] = useState(0);
    const [qrCodes, setQRCodes] = useState([]);
    const navigate = useNavigate();

    function handleNumberChange(event) {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            setNumber(event.target.value);
        }
    }

    useEffect(() => {
        if (number > 0) {
            const codes = Array.from({ length: number }, () =>
                generateRandomString(64)
            );
            const fetchQRCodes = async () => {
                const updatedCodes = await Promise.all(
                    codes.map(async (qr) => {
                        try {
                            const response = await fetch(
                                "/api/qrCodePatientExists",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${adminToken}`,
                                    },
                                    body: JSON.stringify({ qr_code: qr }),
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
                                navigate("/AdminLandingPage");
                            }

                            if (
                                data.status &&
                                data.status.toUpperCase() === "SUCCESS"
                            ) {
                                return qr;
                            }

                            return null; // Return null for codes that already exist
                        } catch (error) {
                            console.error("Error fetching QR codes:", error);
                            return null; // Return null for failed fetches
                        }
                    })
                );

                setQRCodes(updatedCodes.filter((code) => code !== null));
            };

            fetchQRCodes();
        }
    }, [number, adminToken, navigate]);

    function generateRandomString(length) {
        const charset =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charsetLength = charset.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charsetLength);
            result += charset[randomIndex];
        }

        return result;
    }

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
            <h2>Patienten QR-Codes generieren</h2>
            <p>
                Bitte auswählen, wie viele Patienten QR-Codes generiert werden
                sollen
            </p>
            <input
                style={{ width: "300px" }}
                type="number"
                id="numberInput"
                value={number}
                onChange={handleNumberChange}
                placeholder="Bitte hier die Anzahl eingeben"
            />
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
