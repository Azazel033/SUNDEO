import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AccountInfo() {
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userToFetch = username || localStorage.getItem('username');
      const response = await axios.get(`http://localhost:5130/api/Users/username/${userToFetch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleViewSolarPlants = () => {
    navigate(`/admin-dashboard/plantas/${userData.userId}`);
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
        {userData.role === 'user' && (
          <div className="info-group">
            <button onClick={handleViewSolarPlants}>Info Plantas Solares</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountInfo