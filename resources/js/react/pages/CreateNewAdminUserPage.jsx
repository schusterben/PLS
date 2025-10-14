import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./../../../css/CreateNewAdminUser.css";

/**
 * Component for creating a new admin user.
 */
const CreateNewAdminUserPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { adminToken } = useStateContext();
  const navigate = useNavigate();

  /** Handle changes in the input fields. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /** Handle form submission to create a new admin user. */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Die Passwörter stimmen nicht überein");
      setSuccessMessage("");
      return;
    }

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

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.error && data.error.toUpperCase() === "UNAUTHORIZED") {
        navigate("/AdminLandingPage");
        return;
      }

      if (data.user) {
        setSuccessMessage("Benutzer wurde erfolgreich angelegt.");
        setFormData({ username: "", password: "", confirmPassword: "" });
        setErrorMessage("");
      } else {
        setErrorMessage("Benutzer konnte nicht angelegt werden.");
      }
    } catch (error) {
      console.error("Benutzer konnte nicht angelegt werden:", error);
      setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="admin-create-page">
      <h2 className="admin-title">Neuen Admin-Benutzer erstellen</h2>

      {successMessage && <p className="admin-status success">{successMessage}</p>}
      {errorMessage && <p className="admin-status error">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-input-group">
          <label htmlFor="username" className="admin-label">
            Benutzername:
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="admin-input"
            required
          />
        </div>

        <div className="admin-input-group">
          <label htmlFor="password" className="admin-label">
            Passwort:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="admin-input"
            required
          />
        </div>

        <div className="admin-input-group">
          <label htmlFor="confirmPassword" className="admin-label">
            Passwort bestätigen:
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="admin-input"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary full">
          Benutzer erstellen
        </button>
      </form>
    </div>
  );
};

export default CreateNewAdminUserPage;
