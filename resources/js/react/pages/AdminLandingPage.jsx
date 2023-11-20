import React, { useState } from "react";
import "./../../../css/Login.css"; // Füge deine eigenen CSS-Stile hinzu
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

export default function AdminLandingPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token, setAdminToken } = useStateContext();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const csrfToken = document.getElementById("root").getAttribute("data-csrf");

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Überprüfe die Anmeldedaten in der Datenbank

        fetch("/api/adminLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            }), // Send the decoded QR code
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Hier kannst du auf die Antwort von Laravel reagieren
                if (data.status.toLowerCase() === "success") {
                    if (data.token) {
                        setAdminToken(data.token);
                    } else {
                        console.error("Authentication failed");
                    }
                    navigate("/AdminSettingsPage");
                } else {
                    // Authentifizierung fehlgeschlagen
                    console.error("Ungültige Anmeldedaten");
                    setError(
                        "Benutzername oder Passwort ist falsch. Bitte versuche es erneut."
                    );
                }
            })
            .catch((error) => console.error("Fetch error:", error));

        // Füge hier deine Anmelde-Logik hinzu
    };

    return (
        <div>
            <div className="login-container">
                <h2 className="Anmeldung">Benutzeranmeldung</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="username">Benutzername:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Passwort:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Anmelden
                    </button>
                    {error && (
                        <p style={{ color: "red" }} className="error-message">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
