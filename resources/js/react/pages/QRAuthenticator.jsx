import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/QrAuthenticator.css";

export default function QrAuthenticator() {
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [scanError, setScanError] = useState("");
  const [isStarting, setIsStarting] = useState(true);

  const { setToken, token } = useStateContext();
  const navigate = useNavigate();

  const scannerRef = useRef(null);            // Html5Qrcode-Instanz
  const isMountedRef = useRef(false);

  const csrfToken = document.getElementById("root")?.getAttribute("data-csrf") || "";

  const startScanner = async () => {
    try {
      if (scannerRef.current?.getState()) return; // läuft schon

      // Instanz erstellen, falls nicht vorhanden
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const config = { fps: 10, qrbox: { width: 320, height: 320 } };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        (errMsg) => setScanError(String(errMsg || "Scan-Fehler"))
      );

      setIsStarting(false);
      setCameraBlocked(false);
      setScanError("");
    } catch (err) {
      setIsStarting(false);
      setCameraBlocked(true);
      setScanError(String(err?.message || err || "Kamera konnte nicht gestartet werden."));
      // Sauber schließen, falls Start fehlgeschlagen ist
      try { await scannerRef.current?.stop(); } catch {}
      try { await scannerRef.current?.clear(); } catch {}
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current?.getState()) {
        await scannerRef.current.stop();
      }
      await scannerRef.current?.clear();
    } catch {}
  };

  useEffect(() => {
    isMountedRef.current = true;
    startScanner();

    // Cleanup beim Unmount
    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminLogin = () => {
    navigate("/AdminLandingPage");
  };

  const onScanSuccess = async (decodedText /*, decodedResult */) => {
    try {
      setScanError("");

      const res = await fetch("/api/qr-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ qr_code: decodedText }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data?.status?.toLowerCase() === "success" && data?.token) {
        setToken(data.token);
        await stopScanner();
        if (!isMountedRef.current) return;
        setAccessGranted(true);
      } else {
        setScanError("Ungültiger QR-Code. Bitte erneut scannen.");
      }
    } catch (e) {
      setScanError("Netzwerk- oder Serverfehler. Bitte später erneut versuchen.");
      console.error(e);
    }
  };

  // Falls schon eingeloggt, direkt weiter
  if (token || accessGranted) return <Navigate to="/RoleSelection" />;

  return (
    <div className="qr-auth-shell">
      <div className="qr-card">
        <header className="qr-card-header">
          <div>
            <h1 className="qr-title">Willkommen im PLS-System</h1>
            <p className="qr-subtitle">
              Scannen Sie Ihren QR-Code, um sich als Einsatzkraft anzumelden.
            </p>
          </div>

          <div className="qr-actions">
          </div>
        </header>

        <div className="qr-layout">
          <section className="qr-info">
            <h2 className="qr-section-title">Hinweis</h2>
            <ul className="qr-list">
              <li><strong>Admin:</strong> Einsatzort erstellen, QR-Codes generieren.</li>
              <li><strong>Einsatzkräfte:</strong> QR-Code vor die Kamera halten.</li>
              <li>Stellen Sie sicher, dass die Kamera-Berechtigung erteilt ist.</li>
            </ul>

            {(cameraBlocked || scanError) && (
              <div className="qr-alert" role="alert">
                {cameraBlocked
                  ? "Zugriff auf die Kamera wurde verweigert. Bitte erlauben Sie den Kamerazugriff in den Browser-Einstellungen."
                  : scanError}
              </div>
            )}
          </section>

          <section className="qr-scanner">
            <div id="qr-reader" className={`qr-reader ${isStarting ? "is-starting" : ""}`} />
            <div className="qr-scanner-actions">
              <button type="button" className="btn btn-ghost" onClick={startScanner}>
                Kamera starten
              </button>
              <button type="button" className="btn btn-ghost" onClick={stopScanner}>
                Kamera stoppen
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
