import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import "./../../../css/ChangeAdminPassword.css";

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

  /** Handle input changes */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /** Handle form submission */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setFailMessage("");

    if (formData.newpassword !== formData.checknewpassword) {
      setFailMessage("Die neuen Passwörter stimmen nicht überein");
      return;
    }

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
        setSuccessMessage("Passwort wurde erfolgreich geändert.");
        setFormData({
          username: usernameFromLocalStorage,
          password: "",
          newpassword: "",
          checknewpassword: "",
        });
      } else if (!response.ok) {
        throw new Error("Fehler im Netz");
      }
    } catch (error) {
      console.error("Fehler beim Ändern des Passworts:", error);
      setFailMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="admin-password-page">
      <h2 className="admin-title">
        Passwort für Benutzer <span className="admin-highlight">{usernameFromLocalStorage}</span> ändern
      </h2>

      {successMessage && <p className="admin-status success">{successMessage}</p>}
      {failMessage && <p className="admin-status error">{failMessage}</p>}

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
            readOnly
            className="admin-input read-only"
          />
        </div>

        <div className="admin-input-group">
          <label htmlFor="password" className="admin-label">
            Aktuelles Passwort:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="admin-input"
          />
        </div>

        <div className="admin-input-group">
          <label htmlFor="newpassword" className="admin-label">
            Neues Passwort:
          </label>
          <input
            id="newpassword"
            type="password"
            name="newpassword"
            value={formData.newpassword}
            onChange={handleInputChange}
            required
            className="admin-input"
          />
        </div>

        <div className="admin-input-group">
          <label htmlFor="checknewpassword" className="admin-label">
            Neues Passwort wiederholen:
          </label>
          <input
            id="checknewpassword"
            type="password"
            name="checknewpassword"
            value={formData.checknewpassword}
            onChange={handleInputChange}
            required
            className="admin-input"
          />
        </div>

        <button type="submit" className="btn btn-primary full">
          Passwort ändern
        </button>
      </form>
    </div>
  );
};

export default ChangeAdminPasswordPage;
