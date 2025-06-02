import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

function SolarPlantsUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);

  const fetchPlants = async () => {
    try {
      const response = await api.get(`/SolarPlants/user/${userId}`);
      setPlants(response.data);
    } catch (error) {
      console.error('Error en el fetch de plantas:', error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [userId]);

  const handleViewDevices = (plantId) => {
    navigate(`/user-dashboard/plant-info/${plantId}`);
  };

  return (
    <div className="users-table-container">
      <h2 style={{ color: 'white' }}>Mis Platas</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad (kW)</th>
              <th>Fecha de Instalación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.plantId}>
                <td>{plant.plantId}</td>
                <td>{plant.plantName}</td>
                <td>{plant.capacityKw} kW</td>
                <td>{new Date(plant.installDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleViewDevices(plant.plantId)} className="btn btn-secondary">
                      <i className="fas fa-eye"></i> Ver Detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SolarPlantsUser;
