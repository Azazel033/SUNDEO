<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UsersTable.css';  // Asegúrate de que el archivo CSS esté disponible

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

  // Fetch plants data
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
      console.log('Datos de plantas recibidos:', data);
      setPlants(data);

    } catch (error) {
      console.error('Error en el fetch de plantas:', error);
    }
  };
=======
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SolarPlants() {
  const [plants, setPlants] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();
>>>>>>> 8967282d181202b5c76af2a77c6ef486de50b10e

  useEffect(() => {
    fetchPlants();
  }, [userId]);

<<<<<<< HEAD
  // Handle form input change
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle creation of a new plant
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
        fetchPlants(); // Refresh list
      } else {
        console.error('Error creando planta:', await response.text());
      }
    } catch (error) {
      console.error('Error en fetch:', error);
    }
  };

  return (
    <div>
      <h2>Plantas del usuario {userId}</h2>

      {/* Botón para agregar una nueva planta */}
      <button onClick={() => setShowModal(true)} className="add-plant-button">Agregar Planta</button>

      {/* Modal para agregar una nueva planta */}
      {showModal && (
        <div className="modal-overlay">
          <div className="account-info-container">
            <h3>Agregar Nueva Planta</h3>
            <form>
              <div className="info-group">
                <label>Nombre:</label>
                <input 
                  name="plantName" 
                  value={formData.plantName} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="info-group">
                <label>Capacidad (kW):</label>
                <input 
                  name="capacityKw" 
                  type="number" 
                  value={formData.capacityKw} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="info-group">
                <label>Fecha instalación:</label>
                <input 
                  name="installDate" 
                  type="datetime-local" 
                  value={formData.installDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="info-group">
                <label>Latitud:</label>
                <input 
                  name="latitude" 
                  type="number" 
                  value={formData.latitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="info-group">
                <label>Longitud:</label>
                <input 
                  name="longitude" 
                  type="number" 
                  value={formData.longitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCreate} className="submit-button">Crear</button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla para mostrar las plantas */}
=======
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
>>>>>>> 8967282d181202b5c76af2a77c6ef486de50b10e
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad (kW)</th>
              <th>Fecha de Instalación</th>
<<<<<<< HEAD
=======
              <th>Latitud</th>
              <th>Longitud</th>
>>>>>>> 8967282d181202b5c76af2a77c6ef486de50b10e
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.plantId}>
                <td>{plant.plantId}</td>
                <td>{plant.plantName}</td>
<<<<<<< HEAD
                <td>{plant.capacityKw} kW</td>
                <td>{new Date(plant.installDate).toLocaleDateString()}</td>
                <td>
                  <button className="edit-button">Editar</button>
                  {/* Aquí puedes agregar funcionalidad para editar la planta */}
=======
                <td>{plant.capacityKw}</td>
                <td>{new Date(plant.installDate).toLocaleDateString()}</td>
                <td>{plant.latitude}</td>
                <td>{plant.longitude}</td>
                <td>
                  <button onClick={() => handleViewDetails(plant.plantId)}>
                    Ver Detalles
                  </button>
>>>>>>> 8967282d181202b5c76af2a77c6ef486de50b10e
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default SolarPlants;
=======
export default SolarPlants;
>>>>>>> 8967282d181202b5c76af2a77c6ef486de50b10e
