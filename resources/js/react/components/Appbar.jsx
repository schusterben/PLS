import React from "react";
import "../../../css/title.css";

/**
 * Die `Appbar`-Komponente stellt die Kopfzeile der Anwendung dar.
 * Sie zeigt das Logo und zwei Navigationslinks an.
 * Der Benutzer kann über die Links zur Admin-Seite oder zur Startseite navigieren.
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
