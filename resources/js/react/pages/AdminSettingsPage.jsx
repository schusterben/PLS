import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { IoIosLogOut } from "react-icons/io";
import { FaKey } from "react-icons/fa";

/**
 * Component for the admin settings page.
 */
export default function AdminSettingsPage() {
    const navigate = useNavigate();
    const { adminToken, setAdminToken } = useStateContext();

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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "30px" }}>
                <button onClick={handleLogout} className="action-button">
                    <IoIosLogOut /> Logout
                </button>
                <button onClick={handleChangePassword} className="action-button">
                    <FaKey /> Passwort ändern
                </button>
            </div>

            {/* Authorization QR Code Section */}
            <fieldset className="settings-group">
                <legend>Authorizierungs QR-Codes (Einsatzkräfte)</legend>
                <button onClick={() => navigate("/CreateLoginQrCodesPage")} className="wide-button">
                    QR-Codes für Authorizierung erzeugen
                </button>
                <button onClick={() => navigate("/ShowUnusedLoginQrCodesPage")} className="wide-button">
                    Nicht verwendete QR-Codes anzeigen
                </button>
            </fieldset>

            {/* Patient QR Code Section */}
            <fieldset className="settings-group">
                <legend>Patienten QR-Codes</legend>
                <button onClick={() => navigate("/CreatePatientQrCodePage")} className="wide-button">
                    Patienten QR-Codes erzeugen
                </button>
                <button onClick={() => navigate("/ShowUnusedPatientQrCodesPage")} className="wide-button">
                    Nicht verwendete QR-Codes anzeigen
                </button>
            </fieldset>

            {/* Operation Scene Section */}
            <fieldset className="settings-group">
                <legend>Einsatzort</legend>
                <button onClick={() => navigate("/EditOperationScene")} className="wide-button">
                    Einsatzort erstellen/bearbeiten
                </button>
            </fieldset>

            {/* Admin User Section */}
            <fieldset className="settings-group">
                <legend>Admin-Management</legend>
                <button onClick={() => navigate("/CreateNewAdminUserPage")} className="wide-button">
                    Admin-User erstellen
                </button>
            </fieldset>
        </div>
    );
}
