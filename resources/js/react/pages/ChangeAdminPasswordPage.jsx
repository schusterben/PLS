import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.newpassword !== formData.checknewpassword) {
            console.log("Passwords do not match");
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
                    throw new Error("Network response was not ok");
                }
            } catch (error) {
                console.error("Benutzer konnte nicht angelegt werden:", error);
            }
        }
    };

    return (
        <div>
            <h2>Passwort für den Benutzer {usernameFromLocalStorage} ändern</h2>
            {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
            )}
            {failMessage && <p style={{ color: "red" }}>{failMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ color: "white" }}>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            readOnly="true"
                        />
                    </label>
                </div>
                <div>
                    <label style={{ color: "white" }}>
                        aktuelles Passwort:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label style={{ color: "white" }}>
                        neues Passwort:
                        <input
                            type="password"
                            name="newpassword"
                            value={formData.newpassword}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label style={{ color: "white" }}>
                        neues Passwort wiederholen:
                        <input
                            type="password"
                            name="checknewpassword"
                            value={formData.checknewpassword}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Erstellen</button>
            </form>
        </div>
    );
};

export default ChangeAdminPasswordPage;
