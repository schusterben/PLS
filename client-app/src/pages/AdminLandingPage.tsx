import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { adminLogin } from '../api/endpoints';
import Appbar from '../components/Appbar';

export default function AdminLandingPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;
  const { setToken, setAdminToken } = useAuthStore();
  const devButtonsEnabled = import.meta.env.VITE_ENABLE_DEV_BUTTONS === 'true';

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await adminLogin(formData.username, formData.password);
      if (data.status.toLowerCase() === 'success' && data.token) {
        setToken(null);
        setAdminToken(data.token);
        localStorage.setItem('Username', formData.username);
        if (data.requiresPasswordChange) {
          navigate('/ChangeAdminPasswordPage', { state: { username: formData.username } });
        } else {
          navigate('/AdminSettingsPage');
        }
      } else {
        setError('Benutzername oder Passwort ist falsch. Bitte versuche es erneut.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Fehler bei der Anmeldung. Bitte versuche es nochmal.');
    }
  };

  return (
    <>
      <Appbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Admin-Anmeldung</h2>
          <p>Geben Sie Ihre Zugangsdaten ein, um sich als Admin anzumelden.</p>
          {successMessage && <p className="msg-success">{successMessage}</p>}
          {errorMessage && <p className="msg-error">{errorMessage}</p>}
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="password">Passwort:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                placeholder="Geben Sie Ihr Passwort ein"
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Anmelden</button>
          </form>
          <button onClick={() => navigate('/qrAuthenticator')} className="btn-secondary" style={{ marginTop: '12px', width: '100%' }}>
            Zurück
          </button>
          {devButtonsEnabled && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={async () => {
                  const { data } = await adminLogin('admin', 'admin');
                  if (data.token) {
                    setToken(null);
                    setAdminToken(data.token);
                    navigate('/AdminSettingsPage');
                  }
                }}
                style={{ background: '#e53e3e', color: 'white', padding: '10px 20px', border: '2px dashed #feb2b2', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                DEV: Skip to Admin Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
