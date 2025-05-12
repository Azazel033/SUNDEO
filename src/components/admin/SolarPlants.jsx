import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SolarPlants() {
  const [plants, setPlants] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlants();
  }, [userId]);

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5130/api/SolarPlants/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlants(response.data);
    } catch (error) {
      console.error('Error al obtener plantas solares:', error);
    }
  };

  const handleViewDetails = (plantId) => {
    navigate(`/admin-dashboard/plantas/${userId}/detalles/${plantId}`);
  };

  return (
    <div className="solar-plants-container">
      <h2>Plantas Solares</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad (kW)</th>
              <th>Fecha de Instalación</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.plantId}>
                <td>{plant.plantId}</td>
                <td>{plant.plantName}</td>
                <td>{plant.capacityKw}</td>
                <td>{new Date(plant.installDate).toLocaleDateString()}</td>
                <td>{plant.latitude}</td>
                <td>{plant.longitude}</td>
                <td>
                  <button onClick={() => handleViewDetails(plant.plantId)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SolarPlants;