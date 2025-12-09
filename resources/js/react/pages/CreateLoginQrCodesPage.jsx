import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./../../../css/CreateQrCodes.css";

/**
 * Component for creating and printing login QR codes.
 */
export default function CreateLoginQrCodesPage() {
  const { adminToken } = useStateContext();
  const [requestedQrCount, setRequestedQrCount] = useState(0);
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /**
   * Handle changes in the requested QR code count input.
   * @param {Object} event - The input change event.
   */
  const handleRequestedQrCountChange = (event) => {
    const raw = event.target.value;
    const value = Number(raw);
    if (!Number.isNaN(value) && value >= 0) {
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
          setErrorMessage(""); // Clear any existing error messages
          const response = await fetch("/api/generateLoginQRCodes", {
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

          if (data.error && String(data.error).toUpperCase() === "UNAUTHORIZED") {
            navigate("/AdminLandingPage");
            return;
          }

          if (Array.isArray(data.qrcodes)) {
            setQRCodes(data.qrcodes);
          } else {
            setQRCodes([]);
          }
        } catch (error) {
          setErrorMessage(
            "Es gab einen Fehler bei der Erstellung der QR-Codes. Bitte versuchen Sie es erneut."
          );
        } finally {
          setLoading(false); // Stop loading spinner
        }
      };

      fetchQRCodes();
    }
  }, [loading, adminToken, navigate, requestedQrCount]);

  /**
   * Create and save QR codes as a PDF.
   */
  const printQrCodesToPDF = () => {
    if (!qrCodes.length) return;
    const doc = new jsPDF();

    qrCodes.forEach((_, index) => {
      if (index !== 0) doc.addPage();
      const canvas = document.getElementById(`qrcode-${index}`);
      if (!canvas) return;
      const qrCodeDataURL = canvas.toDataURL("image/png");
      doc.setFontSize(14);
      doc.text(`Login QR Code #${index + 1}`, 20, 20);
      doc.addImage(qrCodeDataURL, "PNG", 50, 30, 100, 100);
    });

    doc.save("login_qrcodes.pdf");
  };

  /**
   * Handle the click event to generate login QR codes.
   */
  const generateLoginQRCodes = () => {
    if (requestedQrCount > 0) {
      setLoading(true);   // Start loading
      setQRCodes([]);     // Clear previous QR codes
      setErrorMessage(""); 
    } else {
      setErrorMessage("Bitte geben Sie eine gültige Anzahl ein.");
    }
  };

  return (
    <div className="qr-create-page" role="main" aria-labelledby="qrCreateTitle">
      <div className="qr-create-header">
        <h2 id="qrCreateTitle" className="qr-create-title">
          QR-Codes für die Authentifizierung generieren
        </h2>
        <p className="qr-create-subtitle">
          Wählen Sie die Anzahl der zu generierenden QR-Codes aus.
        </p>
      </div>

      <form
        className="qr-create-form"
        onSubmit={(e) => {
          e.preventDefault();
          generateLoginQRCodes();
        }}
      >
        <label htmlFor="requestedQrCountInput" className="qr-label">
          Anzahl
        </label>
        <input
          className="qr-input"
          type="number"
          id="requestedQrCountInput"
          min="0"
          value={requestedQrCount}
          onChange={handleRequestedQrCountChange}
          placeholder="Anzahl eingeben"
          aria-describedby="qrHelp"
          inputMode="numeric"
        />
        <div id="qrHelp" className="qr-help">
          Geben Sie die gewünschte Anzahl an QR-Codes ein und klicken Sie auf „Generieren“.
        </div>

        <div className="qr-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Wird generiert…" : "QR-Codes generieren"}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={printQrCodesToPDF}
            disabled={qrCodes.length === 0}
            title={qrCodes.length === 0 ? "Keine QR-Codes vorhanden" : "Als PDF drucken"}
          >
            Als PDF drucken
          </button>
        </div>
      </form>

      {loading && (
        <div className="qr-status info" role="status">
          <span className="spinner" aria-hidden="true" /> QR-Codes werden generiert…
        </div>
      )}

      {!!errorMessage && (
        <div className="qr-status error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="qr-grid" aria-live="polite">
        {qrCodes.map((code, index) => (
          <div key={index} className="qr-card">
            <QRCode id={`qrcode-${index}`} value={code} size={180} />
            <p className="qr-caption">QR Code #{index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
