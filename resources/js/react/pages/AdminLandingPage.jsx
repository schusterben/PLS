import React, { useState } from "react";
import "./../../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

export default function AdminLandingPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setError] = useState("");
    const navigate = useNavigate();
    const { setAdminToken } = useStateContext();

    const handleInputChange = ({ target }) => {
        const { name, value } = target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const csrfToken = document.getElementById("root").getAttribute("data-csrf");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/adminLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.status.toLowerCase() === "success" && data.token) {
                setAdminToken(data.token);
                localStorage.setItem("Username", formData.username);
                navigate("/AdminSettingsPage");
            } else {
                setError(
                    "Benutzername oder Passwort ist falsch. Bitte versuche es erneut."
                );
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
        }
    };

    return (
        <div>
            <div className="login-container">
                <h2 className="Anmeldung">Benutzeranmeldung</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
                </form>
            </div>
        </div>
    );
}
