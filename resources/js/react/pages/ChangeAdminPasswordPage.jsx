import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Component for changing the admin user's password.
 */
const ChangeAdminPasswordPage = () => {
    const location = useLocation();
    const usernameFromLocalStorage = location.state?.username;

    const [formData, setFormData] = useState({
        username: usernameFromLocalStorage,
        password: "",
        newpassword: "",
        checknewpassword: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [failMessage, setFailMessage] = useState("");
    const { adminToken } = useStateContext();
    const navigate = useNavigate();

    /**
     * Handle input changes in the form.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handle form submission.
     * @param {Object} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.newpassword !== formData.checknewpassword) {
            setFailMessage("Die neuen Passwörter stimmen nicht überein");
            return;
        } else {
            try {
                const response = await fetch("/api/changeAdminPassword", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                        newpassword: formData.newpassword,
                    }),
                });

                const data = await response.json();

                if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
                    navigate("/AdminLandingPage");
                    return;
                }
                if (data.user) {
                    setSuccessMessage("Passwort wurde erfolgreich geändert");
                    setFormData({
                        password: "",
                        newpassword: "",
                        checknewpassword: "",
                    });
                }
                if (!response.ok) {
                    throw new Error("Fehler im Netz");
                }
            } catch (error) {
                console.error("Fehler beim Ändern des Passworts:", error);
            }
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h2>Passwort für den Benutzer {usernameFromLocalStorage} ändern</h2>
            {successMessage && (
                <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
            )}
            {failMessage && (
                <p style={{ color: "red", fontWeight: "bold" }}>{failMessage}</p>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Benutzername:
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        readOnly
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Passwort:
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Neues Passwort:
                    </label>
                    <input
                        type="password"
                        name="newpassword"
                        value={formData.newpassword}
                        onChange={handleInputChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Neues Passwort wiederholen:
                    </label>
                    <input
                        type="password"
                        name="checknewpassword"
                        value={formData.checknewpassword}
                        onChange={handleInputChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#0047ab",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Passwort ändern
                </button>
            </form>
        </div>
    );
};

export default ChangeAdminPasswordPage;
