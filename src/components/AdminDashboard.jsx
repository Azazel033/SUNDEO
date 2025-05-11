import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api-ejemplo.com/users', {
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
      const response = await axios.get('https://api-ejemplo.com/profile', {
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
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>
      
      <nav>
        <button onClick={fetchData}>Consultar Datos</button>
        <button onClick={fetchProfile}>Ver Perfil</button>
      </nav>

      {profile && (
        <div className="profile-section">
          <h2>Mi Perfil</h2>
          <p>Usuario: {profile.username}</p>
          <p>Rol: {profile.role}</p>
        </div>
      )}

      <div className="data-section">
        <h2>Datos de Usuarios</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userData.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => alert('Editar usuario')}>Editar</button>
                  <button onClick={() => alert('Eliminar usuario')}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;