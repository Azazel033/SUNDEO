import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';
const axios = api;
import './AccountInfo.css';


function AccountInfo() {
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const navigate = useNavigate();

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
      console.log('User data:', response.data); // Para depuración
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleViewSolarPlants = () => {
    if (userData && userData.userId) {
      console.log(`/admin-dashboard/plantas/${userData.userId}`)
      navigate(`/admin-dashboard/plantas/${userData.userId}`);
      
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
        {userData.role.toLowerCase() === 'user' && (
          <div className="info-group">
            <button 
              onClick={handleViewSolarPlants}
              className="solar-plants-button"
            >
              Info Plantas Solares
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountInfo;