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

    function onClickShowUnusedQrCodes() {
        navigate("/ShowUnusedQrCodesPage");
    }

    function onClickCreateNewAdminUser() {
        navigate("/CreateNewAdminUserPage");
    }

    function onClickLogout() {
        setAdminToken(null);
        window.location.reload();
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

            <button onClick={onClickQrCreate}>
                Patienten QR-Codes erzeugen
            </button>
            <button onClick={onClickShowUnusedQrCodes}>
                Nicht verwendete QR-Codes
            </button>
            <button onClick={onClickCreateNewAdminUser}>
                Admin-User erstellen
            </button>
        </div>
    );
}
