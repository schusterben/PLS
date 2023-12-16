import React from "react";
import "../../../css/title.css";

/**
 * The `Appbar` component represents the application header.
 * It includes a logo and navigation links.
 */
export default function Appbar() {
    return (
        <div className="header">
            <div className="logo">
                <img src="logo.png" width={140} height={80}></img>
            </div>
            <div className="links">
                <a href="/AdminSettingsPage" className="admin-text">
                    Admin
                </a>
                <a href="/" className="admin-text">
                    Home
                </a>
            </div>
        </div>
    );
}
