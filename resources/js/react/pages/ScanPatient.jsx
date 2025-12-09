import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/ScanPatient.css";

export default function ScanPatient() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useStateContext();

  const operationScene = location.state?.operationScene;

  const [cameraBlocked, setCameraBlocked] = useState(false);
  const scannerRef = useRef(null);

  const safeStopScanner = async () => {
    if (!scannerRef.current) return;
    try {
      const state = await scannerRef.current.getState?.();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scannerRef.current.stop();
      }
      await scannerRef.current.clear();
    } catch (err) {
    }
  };

  /** Scanner initialisieren */
  useEffect(() => {
    const initScanner = async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode("reader");
        }
        const config = { fps: 5, qrbox: { width: 240, height: 240 } };
        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback
        );
      } catch (error) {
        console.warn("Scanner konnte nicht gestartet werden:", error);
        setCameraBlocked(true);
      }
    };

    initScanner();

    return () => {
      safeStopScanner();
    };
  }, []);

  /** Erfolg-Callback */
  const qrCodeSuccessCallback = (decodedText) => {
    onScanSuccess(decodedText);
  };

  /** Erfolgreicher Scan */
  const onScanSuccess = (decodedText) => {
    fetch("/api/verify-patient-qr-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        qr_code: decodedText,
        operationScene,
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (data?.error?.toUpperCase() === "UNAUTHORIZED") {
            navigate("/AdminLandingPage");
            return Promise.reject(new Error("UNAUTHORIZED"));
          }
          return Promise.reject(new Error("Netzwerkantwort war nicht ok"));
        }
        return data;
      })
      .then(async (data) => {
        if (data?.patientId) {
          await safeStopScanner(); // Stop jetzt sicher
          navigate("/TriagePage1", {
            state: {
              patientId: data.patientId,
              operationScene,
            },
          });
        } else {
          console.error("Ungültiger QR-Code oder Patient nicht gefunden.");
        }
      })
      .catch((error) => {
        console.error("Fehler beim Verifizieren des QR-Codes:", error);
      });
  };

  return (
    <div className="scan-page" role="main" aria-labelledby="scanTitle">
      <div className="scan-card">
        <h2 id="scanTitle" className="scan-title">
          Bitte einen Patienten-QR-Code scannen
        </h2>

        <div className="scan-reader-wrap">
          <div id="reader" className="scan-reader" />
        </div>

        {cameraBlocked && (
          <p className="scan-status error" role="alert">
            Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben Sie den
            Zugriff über die Einstellungen.
          </p>
        )}
      </div>
    </div>
  );
}
