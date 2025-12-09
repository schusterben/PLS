import React, { useState } from "react";
import "./../../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setAdminToken } = useStateContext();

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CSRF-Token vom Root-Element
  const csrfToken = document.getElementById("root")?.getAttribute("data-csrf") || "";

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setError("");

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

      if (data?.status?.toLowerCase() === "success" && data?.token) {
        setAdminToken(data.token);
        localStorage.setItem("Username", formData.username);
        // Falls du zuerst zur Admin-Landing willst, ändere das hier:
        navigate("/AdminSettingsPage");
      } else {
        setError("Benutzername oder Passwort ist falsch. Bitte versuche es erneut.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Fehler bei der Anmeldung. Bitte versuche es nochmal.");
    }
  };

  return (
    <div className="auth-page">
      <div className="login-card" role="dialog" aria-labelledby="login-title" aria-modal="true">
        <h2 id="login-title" className="login-title">Admin-Anmeldung</h2>
        <p className="login-subtitle">
          Geben Sie Ihre Zugangsdaten ein, um sich als Admin anzumelden.
        </p>

        {errorMessage && (
          <p className="login-error" role="alert">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleAdminLogin} className="admin-login-form" noValidate>
          <div className="input-container">
            <label htmlFor="username">Benutzername</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Geben Sie Ihren Benutzernamen ein"
              value={formData.username}
              onChange={handleInputChange}
              required
              aria-required="true"
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">Passwort</label>
            <div className="password-row">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Geben Sie Ihr Passwort ein"
                value={formData.password}
                onChange={handleInputChange}
                required
                aria-required="true"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPassword ? "Verbergen" : "Anzeigen"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">Anmelden</button>

          {/* Optionaler Footer – nur wenn du Links brauchst
          <div className="login-actions">
            <a href="/forgot-password">Passwort vergessen?</a>
            <a href="/help">Hilfe</a>
          </div>
          */}
        </form>
      </div>
    </div>
  );
}
