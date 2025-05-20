import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('http://localhost:5130/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('https://api-ejemplo.com/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Panel de Usuario</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <nav>
        <button onClick={fetchUserData}>Consultar Mis Datos</button>
        <button onClick={fetchProfile}>Ver Perfil</button>
      </nav>

      {profile && (
        <div className="profile-section">
          <h2>Mi Perfil</h2>
          <p>Usuario: {profile.username}</p>
          <p>Rol: {profile.role}</p>
        </div>
      )}

      {userData && (
        <div className="data-section">
          <h2>Mis Datos</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;