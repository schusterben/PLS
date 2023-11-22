import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSettingsPage() {
    const navigate = useNavigate();

    function onClickQrCreate() {
        navigate("/CreatePatientQrCodePage");
    }

    function onClickShowUnusedQrCodes() {
        navigate("/ShowUnusedQrCodesPage");
    }

    return (
        <div>
            <button onClick={onClickQrCreate}>
                Patienten QR-Codes erzeugen
            </button>
            <button onClick={onClickShowUnusedQrCodes}>
                Nicht verwendete QR-Codes
            </button>
            <button>Admin-User erstellen</button>
        </div>
    );
}
