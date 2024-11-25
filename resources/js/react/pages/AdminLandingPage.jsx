import React, { useState } from "react";
import "./../../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * Component for Admin Login page.
 */
export default function AdminLoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setError] = useState("");
    const navigate = useNavigate();
    const { setAdminToken } = useStateContext();

    /**
     * Handle input field changes.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = ({ target }) => {
        const { name, value } = target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Get the CSRF token from the root element's data attribute
    const csrfToken = document.getElementById("root").getAttribute("data-csrf");

    /**
     * Handle admin login form submission.
     * @param {Object} event - The form submit event.
     */
    const handleAdminLogin = async (event) => {
        event.preventDefault();

        try {
            // Send a POST request to the adminLogin endpoint
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
                setError("Benutzername oder Passwort ist falsch. Bitte versuche es erneut.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Fehler bei der Anmeldung. Bitte versuche es nochmal.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="Anmeldung">Admin-Anmeldung</h2>
            <p>Geben Sie Ihre Zugangsdaten ein, um sich als Admin anzumelden.</p>
            {errorMessage && (
                <p style={ { color: "red", fontWeight: "bold", textAlign: "center"}}>
                    {errorMessage}
                </p>
            )}
            <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="input-container">
                <label htmlFor="username">Benutzername:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    placeholder="Geben Sie Ihren Benutzernamen ein"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="input-container">
                <label htmlFor="password">Passwort:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    placeholder={"Geben Sie Ihr Passwort ein"}
                    onChange={handleInputChange}
                    required
                />
            </div>
                <button type="submit" className="login-button">
                Anmelden
                </button>
            </form>
        </div>
    );
}
