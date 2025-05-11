import { useState, useEffect } from 'react';
import axios from 'axios';

function AccountInfo() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const response = await axios.get(`http://localhost:5130/api/Users/username/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  if (!userData) {
    return <div>Cargando información de la cuenta...</div>;
  }

  return (
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
      </div>
    </div>
  );
}

export default AccountInfo;