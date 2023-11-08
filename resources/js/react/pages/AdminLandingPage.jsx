import React, { useState } from "react";
import "./../../../css/Login.css"; // Füge deine eigenen CSS-Stile hinzu
import { useNavigate } from "react-router-dom";

export default function AdminLandingPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Überprüfe die Anmeldedaten in der Datenbank
        if (formData.username === "admin" && formData.password === "admin") {
            navigate("/AdminSettingsPage");
        } else {
            setError(
                "Benutzername oder Passwort ist falsch. Bitte versuche es erneut."
            );
        }
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
