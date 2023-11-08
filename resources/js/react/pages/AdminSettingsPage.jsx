import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSettingsPage() {
    const navigate = useNavigate();

    function onClickQrCreate() {
        navigate("/CreatePatientQrCodePage");
    }

    return (
        <div>
            <button onClick={onClickQrCreate}>
                Patienten QR-Codes erzeugen
            </button>
            <button>Admin-User erstellen</button>
        </div>
    );
}
