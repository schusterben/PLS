import React, { useState } from "react";
import "./../../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * Component for the admin login page.
 */
export default function AdminLandingPage() {
    // Initialize state variables for form data and error message
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
     * Handle form submission.
     * @param {Object} event - The form submit event.
     */
    const handleSubmit = async (event) => {
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
                // Set the admin token and store the username in local storage
                setAdminToken(data.token);
                localStorage.setItem("Username", formData.username);
                // Navigate to the admin settings page
                navigate("/AdminSettingsPage");
            } else {
                // Display an error message for invalid login credentials
                setError(
                    "Benutzername oder Passwort ist falsch. Bitte versuche es erneut."
                );
            }
        } catch (error) {
            console.error("Fetch error:", error);

            // Display a generic error message for login failure
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
