import React from "react";
import "../../../css/title.css";

export default function Appbar() {
    return (
        <div className="header">
            <div className="logo">PLS</div>
            <a href="/AdminSettingsPage" className="admin-text">
                Admin
            </a>
        </div>
    );
}
