import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { IoIosLogOut } from "react-icons/io";
import { FaKey } from "react-icons/fa";

export default function AdminSettingsPage() {
    const navigate = useNavigate();
    const { adminToken, setAdminToken } = useStateContext();

    function onClickQrCreate() {
        navigate("/CreatePatientQrCodePage");
    }

    function onClickEditOperationScene() {
        navigate("/EditOperationScene");
    }

    function onClickShowUnusedQrCodes() {
        navigate("/ShowUnusedPatientQrCodesPage");
    }

    function onClickCreateNewAdminUser() {
        navigate("/CreateNewAdminUserPage");
    }

    function onClickLogout() {
        setAdminToken(null);
        window.location.reload();
    }

    function onClickLoginQrCreate() {
        navigate("/CreateLoginQrCodesPage");
    }

    function onClickShowUnusedLoginQrCodes() {
        navigate("/ShowUnusedLoginQrCodesPage");
    }
    function onClickChangePassword() {
        navigate("/ChangeAdminPasswordPage", {
            state: { username: localStorage.getItem("Username") },
        });
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div style={{ flexDirection: "row", marginBottom: "50px" }}>
                <button onClick={onClickLogout} style={{ fontSize: "12px" }}>
                    <IoIosLogOut /> Logout
                </button>
                <button
                    onClick={onClickChangePassword}
                    style={{ fontSize: "12px" }}
                >
                    <FaKey /> Passwort ändern
                </button>
            </div>
            <fieldset
                style={{
                    borderColor: "white",
                    border: "1px solid black",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <legend>Authorizierungs Qr-Codes</legend>
                <button
                    onClick={onClickLoginQrCreate}
                    style={{ width: "350px" }}
                >
                    QR-Codes für Authorizierung erzeugen
                </button>
                <button
                    onClick={onClickShowUnusedLoginQrCodes}
                    style={{ width: "350px" }}
                >
                    Nicht verwendete QR-Codes
                </button>
            </fieldset>
            <fieldset
                style={{
                    borderColor: "white",
                    border: "1px solid black",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <legend>Patienten Qr-Codes</legend>
                <button onClick={onClickQrCreate} style={{ width: "350px" }}>
                    Patienten QR-Codes erzeugen
                </button>
                <button
                    onClick={onClickShowUnusedQrCodes}
                    style={{ width: "350px" }}
                >
                    Nicht verwendete QR-Codes
                </button>
            </fieldset>
            <button
                onClick={onClickCreateNewAdminUser}
                style={{ width: "350px" }}
            >
                Admin-User erstellen
            </button>
            <button
                onClick={onClickEditOperationScene}
                style={{ width: "350px" }}
            >
                Einsatzort erstellen/bearbeiten
            </button>
        </div>
    );
}
