import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

function SolarPlants() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plantName: '',
    capacityKw: '',
    installDate: '',
    latitude: '',
    longitude: ''
  });

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

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleViewDevices = (plantId) => {
    navigate(`/plant-info/${plantId}`);
  };

  const handleCreate = async () => {
    try {
      await api.post('/SolarPlants', {
        userId: parseInt(userId),
        plantName: formData.plantName,
        capacityKw: parseFloat(formData.capacityKw),
        installDate: formData.installDate,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      setShowModal(false);
      setFormData({
        plantName: '',
        capacityKw: '',
        installDate: '',
        latitude: '',
        longitude: ''
      });
      fetchPlants();
    } catch (error) {
      console.error('Error creando planta:', error.response?.data || error.message);
    }
  };

  return (
    <div className="users-table-container">
      <h2>Plantas del usuario {userId}</h2>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>Agregar Planta</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nueva Planta</h3>
            <form className="form-container">
              <div className="form-group">
                <label>Nombre:</label>
                <input 
                  name="plantName" 
                  value={formData.plantName} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Capacidad (kW):</label>
                <input 
                  name="capacityKw" 
                  type="number" 
                  value={formData.capacityKw} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Fecha instalación:</label>
                <input 
                  name="installDate" 
                  type="datetime-local" 
                  value={formData.installDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Latitud:</label>
                <input 
                  name="latitude" 
                  type="number" 
                  value={formData.latitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Longitud:</label>
                <input 
                  name="longitude" 
                  type="number" 
                  value={formData.longitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="action-buttons">
                <button type="button" onClick={handleCreate} className="btn btn-primary">Crear</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default SolarPlants;
