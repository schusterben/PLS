import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { IoIosLogOut } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import "./../../../css/AdminSettings.css";

/**
 * AdminSettingsPage
 * - modernes, einheitliches, responsives Layout (Handy/Tablet/Desktop)
 * - Funktionen, Texte, Farben bleiben unverändert
 * - bessere Accessibility (Focus, Touch-Targets, ARIA)
 */
export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { setAdminToken } = useStateContext();

  const handleLogout = () => {
    setAdminToken(null);
    window.location.reload();
  };

  const handleChangePassword = () => {
    navigate("/ChangeAdminPasswordPage", {
      state: { username: localStorage.getItem("Username") },
    });
  };

  return (
    <main className="admin-settings" role="main">
      <div className="admin-shell">
        {/* Header */}
        <header className="admin-header" aria-label="Admin Aktionen">
          <div className="actions" role="group" aria-label="Sitzung">
            <button
              type="button"
              onClick={handleLogout}
              className="btn"
              aria-label="Logout"
            >
              <IoIosLogOut aria-hidden="true" /> Logout
            </button>
          </div>

          <div className="actions" role="group" aria-label="Sicherheit">
            <button
              type="button"
              onClick={handleChangePassword}
              className="btn btn--primary"
              aria-label="Passwort ändern"
            >
              <FaKey aria-hidden="true" /> Passwort ändern
            </button>
          </div>
        </header>

        {/* Authorizierungs QR-Codes (Einsatzkräfte) */}
        <section className="settings-card" aria-labelledby="auth-qr-title">
          <h2 id="auth-qr-title" className="settings-title">
            Authorizierungs QR-Codes (Einsatzkräfte)
          </h2>

          <div className="card-grid">
            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/CreateLoginQrCodesPage")}
            >
              QR-Codes für Authorizierung erzeugen
            </button>

            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/ShowUnusedLoginQrCodesPage")}
            >
              Nicht verwendete QR-Codes anzeigen
            </button>
          </div>
        </section>

        {/* Patienten QR-Codes */}
        <section className="settings-card" aria-labelledby="patient-qr-title">
          <h2 id="patient-qr-title" className="settings-title">
            Patienten QR-Codes
          </h2>

          <div className="card-grid">
            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/CreatePatientQrCodePage")}
            >
              Patienten QR-Codes erzeugen
            </button>

            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/ShowUnusedPatientQrCodesPage")}
            >
              Nicht verwendete QR-Codes anzeigen
            </button>
          </div>
        </section>

        {/* Einsatzort */}
        <section className="settings-card" aria-labelledby="scene-title">
          <h2 id="scene-title" className="settings-title">
            Einsatzort
          </h2>

          <div className="card-grid">
            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/EditOperationScene")}
            >
              Einsatzort erstellen/bearbeiten
            </button>
          </div>
        </section>

        {/* Admin-Management */}
        <section className="settings-card" aria-labelledby="admin-mgmt-title">
          <h2 id="admin-mgmt-title" className="settings-title">
            Admin-Management
          </h2>

          <div className="card-grid">
            <button
              type="button"
              className="btn wide-btn"
              onClick={() => navigate("/CreateNewAdminUserPage")}
            >
              Admin-User erstellen
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
