import { useState, useEffect } from 'react';
import api from '../../api';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.get(`/Users/${userId}`);
      setUserData(response.data);
      setFormData(prev => ({
        ...prev,
        username: response.data.username,
        email: response.data.email
      }));
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
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.currentPassword) {
      setError('Debes ingresar la contraseña actual.');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('La verificación de la nueva contraseña no coincide.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      
      // Construir el payload
      const payload = {
        username: formData.username,
        email: formData.email,
        currentPassword: formData.currentPassword,
        passwordHash: formData.newPassword ? formData.newPassword : undefined, // Enviar solo si se cambia la contraseña
      };

      await api.put(`/Users/edit/${userId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Perfil actualizado correctamente.');
      setShowModal(false);
      fetchUserData();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError('Error al actualizar perfil. Verifica la contraseña actual.');
    }
  };

  if (!userData) return <div>Cargando información del perfil...</div>;

  return (
    <div className="account-info-container">
      <center>
        <h2>Mi Perfil</h2>
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
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Editar Perfil</button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Editar Perfil</h3>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
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
                  <label>Contraseña Actual:</label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <span
                      onClick={() => setShowCurrentPassword(prev => !prev)}
                      className="eye-icon"
                    >
                      <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña:</label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="eye-icon"
                    >
                      <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña:</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="eye-icon"
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
    </div>
  );
}

export default UserProfile;
