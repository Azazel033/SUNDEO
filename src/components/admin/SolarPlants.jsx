import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SolarPlants() {
  const { userId } = useParams();
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
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5130/api/SolarPlants/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error en la respuesta: ${res.status} ${res.statusText}`);
        console.error('Detalle del error:', errorText);
        return;
      }

      const data = await res.json();
      setPlants(data);
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

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/SolarPlants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          plantName: formData.plantName,
          capacityKw: parseFloat(formData.capacityKw),
          installDate: formData.installDate,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          plantName: '',
          capacityKw: '',
          installDate: '',
          latitude: '',
          longitude: ''
        });
        fetchPlants();
      } else {
        console.error('Error creando planta:', await response.text());
      }
    } catch (error) {
      console.error('Error en fetch:', error);
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
                  <button className="btn btn-secondary">Editar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SolarPlants;