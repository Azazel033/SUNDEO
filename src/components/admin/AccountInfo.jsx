import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';
const axios = api;

function AccountInfo() {
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userToFetch = userId || localStorage.getItem('userId');
      const response = await axios.get(`Users/${userToFetch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        passwordHash: ''
      });
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.passwordHash && formData.passwordHash.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/Users/editAdmin/${userData.userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowModal(false);
      fetchUserData();
      setError('');
    } catch (error) {
      console.error('Error al editar el perfil:', error);
      setError('Error al editar el perfil. Intente nuevamente.');
    }
  };

  const handleViewSolarPlants = () => {
    if (userData && userData.userId) {
      navigate(`/admin-dashboard/plantas/${userData.userId}`);
    }
  };

  if (!userData) {
    return <div>Cargando información de la cuenta...</div>;
  }

  return (
    <center>
      <div className="account-info-container">
        <h2>Información de la Cuenta</h2>
        <div className="account-details">
          <div className="info-group">
            <label>Nombre:</label>
            <p>{userData.username}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{userData.email}</p>
          </div>
          <div className="info-group">
            <label>Rol:</label>
            <p>{userData.role}</p>
          </div>
          <div className="info-group">
            <label>Fecha de Registro:</label>
            <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
          {userData.role.toLowerCase() === 'user' && (
            <div className="info-group">
              <button onClick={handleViewSolarPlants} className="btn btn-primary">
                Info Plantas Solares
              </button>
            </div>
          )}
          <div className="info-group">
            <button onClick={() => setShowModal(true)} className="btn btn-secondary">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Perfil</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña:</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="passwordHash"
                    value={formData.passwordHash}
                    onChange={handleInputChange}
                  />
                  <span
                    onClick={() => setShowPassword(prev => !prev)}
                    className="eye-icon"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                </div>
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </center>
  );
}

export default AccountInfo;