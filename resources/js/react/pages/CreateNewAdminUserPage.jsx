import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

/**
 * Component for creating a new admin user.
 */
const CreateNewAdminUserPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const { adminToken } = useStateContext();
    const navigate = useNavigate();

    /**
     * Handle changes in the input fields.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handle form submission to create a new admin user.
     * @param {Object} event - The form submit event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/createAdminUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
                navigate("/AdminLandingPage");
                return;
            }
            if (data.user) {
                setSuccessMessage("Benutzer wurde erfolgreich angelegt");
                setFormData({ username: "", password: "" });
            }
        } catch (error) {
            console.error("Benutzer konnte nicht angelegt werden:", error);
        }
    };

    return (
        <div>
            <h2>Benutzer erstellen</h2>
            {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
            )}
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
                        />
                    </label>
                </div>
                <div>
                    <label style={{ color: "white" }}>
                        Passwort:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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

export default CreateNewAdminUserPage;
