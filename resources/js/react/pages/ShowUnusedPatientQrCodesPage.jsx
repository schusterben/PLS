import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import { useStateContext } from "../contexts/ContextProvider";
import "./../../../css/ShowUnusedQrCodes.css";

/**
 * Component for displaying and generating unused patient QR codes.
 */
export default function ShowUnusedPatientQrCodesPage() {
  const { adminToken } = useStateContext();
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Fetches unused patient QR codes from the API. */
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
        setQRCodes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching QR codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [adminToken]);

  /** Generates a PDF document containing patient QR codes. */
  const generatePatientQRCodesPDF = () => {
    const doc = new jsPDF();

    qrCodes.forEach((_, index) => {
      if (index !== 0) doc.addPage();
      const canvas = document.getElementById(`qrcode-${index}`);
      if (!canvas) return;
      const qrCodeDataURL = canvas.toDataURL("image/png");
      doc.setFontSize(14);
      doc.text(`Patient QR Code #${index + 1}`, 20, 20);
      doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
    });

    doc.save("patient_qrcodes.pdf");
  };

  return (
    <div className="qr-show-page" role="main" aria-labelledby="unusedPatientQrTitle">
      <h2 id="unusedPatientQrTitle" className="qr-show-title">
        Folgende QR-Codes wurden bis jetzt noch bei keinem Patienten verwendet
      </h2>

      {loading ? (
        <p className="qr-status info">QR Codes werden geladen...</p>
      ) : (
        <>
          <div className="qr-actions">
            <button
              className="btn btn-primary"
              onClick={generatePatientQRCodesPDF}
              disabled={qrCodes.length === 0}
              title={qrCodes.length === 0 ? "Keine QR-Codes vorhanden" : "Als PDF drucken"}
            >
              Als PDF drucken
            </button>
          </div>

          <div className="qr-grid" aria-live="polite">
            {qrCodes.map((code, index) => (
              <div className="qr-card" key={index}>
                <QRCode id={`qrcode-${index}`} value={code} size={150} />
                <p className="qr-caption">QR Code #{index + 1}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
