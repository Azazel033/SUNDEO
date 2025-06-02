import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



function PlantasInfoUser() {
  const { plantId } = useParams();
  const [inverters, setInverters] = useState([]);
  const [energyProductions, setEnergyProductions] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [batteries, setBatteries] = useState([]);

  // Estados para modales
  const [showModalEnergy, setShowModalEnergy] = useState(false);
  const [showModalInverter, setShowModalInverter] = useState(false);
  const [showModalPanel, setShowModalPanel] = useState(false);
  const [showModalBattery, setShowModalBattery] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Keys para los IDs de cada entidad
  const entityIdKeys = {
    EnergyProduction: 'productionId',
    Inverters: 'inverterId',
    SolarPanel: 'panelId',
    Battery: 'batteryId'
  };

  // Form data states
  const [formEnergy, setFormEnergy] = useState({
    timestamp: '',
    energyKwh: '',
    dcVoltage: '',
    acVoltage: '',
    temperature: ''
  });

  const [formInverter, setFormInverter] = useState({
    model: '',
    maxPowerKw: '',
    efficiency: '',
    serialNumber: '',
    installationDate: ''
  });

  const [formPanel, setFormPanel] = useState({
    model: '',
    powerRatingW: '',
    orientation: '',
    tiltAngle: '',
    installationDate: ''
  });

  const [formBattery, setFormBattery] = useState({
    model: '',
    capacityKwh: '',
    efficiency: '',
    installationDate: ''
  });

  // Fetch inicial de dispositivos
  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');

      const [energyRes, inverterRes, panelRes, batteryRes] = await Promise.all([
        fetch(`http://localhost:5130/api/EnergyProduction/plant/${plantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5130/api/Inverters/plant/${plantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5130/api/SolarPanel/plant/${plantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5130/api/Battery/plant/${plantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEnergyProductions(await energyRes.json());
      setInverters(await inverterRes.json());
      setSolarPanels(await panelRes.json());
      setBatteries(await batteryRes.json());

    } catch (error) {
      console.error('Error al obtener los dispositivos:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [plantId]);

  // Handlers para inputs modales
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  // Validación de campos
  const validateForm = (form) => {
    return Object.values(form).every(val => val !== '' && val !== null);
  };

  // Función genérica para DELETE
  const handleDelete = async (entityType, id) => {
    if (!window.confirm(`¿Estás seguro de eliminar este ${entityType}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5130/api/${entityType}/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (response.ok) {
        fetchDevices();
        alert(`${entityType} eliminado/a correctamente`);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  // Función genérica para PUT (editar)
  const handleSaveEdit = async (entityType, id, formData, entityIdKey) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        [entityIdKey]: parseInt(id),
        plantId: parseInt(plantId),
        ...formData
      };

      const response = await fetch(`http://localhost:5130/api/${entityType}/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchDevices();
        setEditingId(null);
        // Cerrar el modal correspondiente
        if (entityType === 'EnergyProduction') setShowModalEnergy(false);
        if (entityType === 'Inverters') setShowModalInverter(false);
        if (entityType === 'SolarPanel') setShowModalPanel(false);
        if (entityType === 'Battery') setShowModalBattery(false);
        
        alert(`${entityType} actualizado/a correctamente`);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error al editar: ${error.message}`);
    }
  };

  // Handlers para agregar registros (POST)
  const handleAddEnergyProduction = async (e) => {
    e.preventDefault();
    if (!validateForm(formEnergy)) {
      alert("Por favor completa todos los campos.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/EnergyProduction', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({
          plantId: parseInt(plantId),
          timestamp: formEnergy.timestamp,
          energyKwh: parseFloat(formEnergy.energyKwh),
          dcVoltage: parseFloat(formEnergy.dcVoltage),
          acVoltage: parseFloat(formEnergy.acVoltage),
          temperature: parseFloat(formEnergy.temperature)
        })
      });
      if (response.ok) {
        setShowModalEnergy(false);
        setFormEnergy({ timestamp: '', energyKwh: '', dcVoltage: '', acVoltage: '', temperature: '' });
        fetchDevices();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddInverter = async (e) => {
    e.preventDefault();
    if (!validateForm(formInverter)) {
      alert("Por favor completa todos los campos.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/Inverters', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({
          plantId: parseInt(plantId),
          model: formInverter.model,
          maxPowerKw: parseFloat(formInverter.maxPowerKw),
          efficiency: parseFloat(formInverter.efficiency),
          serialNumber: formInverter.serialNumber,
          installationDate: formInverter.installationDate
        })
      });
      if (response.ok) {
        setShowModalInverter(false);
        setFormInverter({ model: '', maxPowerKw: '', efficiency: '', serialNumber: '', installationDate: '' });
        fetchDevices();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddPanel = async (e) => {
    e.preventDefault();
    if (!validateForm(formPanel)) {
      alert("Por favor completa todos los campos.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/SolarPanel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({
          plantId: parseInt(plantId),
          model: formPanel.model,
          powerRatingW: parseFloat(formPanel.powerRatingW),
          orientation: formPanel.orientation,
          tiltAngle: parseFloat(formPanel.tiltAngle),
          installationDate: formPanel.installationDate
        })
      });
      if (response.ok) {
        setShowModalPanel(false);
        setFormPanel({ model: '', powerRatingW: '', orientation: '', tiltAngle: '', installationDate: '' });
        fetchDevices();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddBattery = async (e) => {
    e.preventDefault();
    if (!validateForm(formBattery)) {
      alert("Por favor completa todos los campos.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/Battery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({
          plantId: parseInt(plantId),
          model: formBattery.model,
          capacityKwh: parseFloat(formBattery.capacityKwh),
          efficiency: parseFloat(formBattery.efficiency),
          installationDate: formBattery.installationDate
        })
      });
      if (response.ok) {
        setShowModalBattery(false);
        setFormBattery({ model: '', capacityKwh: '', efficiency: '', installationDate: '' });
        fetchDevices();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="users-table-container">
      <h2 style={{ color: 'white' }}> Información de la Planta {plantId}</h2>

      {/* --- Sección Producción de Energía --- */}
      <div className="users-table-container">
        <div className="section-header">
          <h3 style={{ color: 'white' }}> Producción de Energía</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Energía (kWh)</th>
                <th>Voltaje DC</th>
                <th>Voltaje AC</th>
                <th>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {energyProductions.length > 0 ? (
                energyProductions.map((prod) => (
                  <tr key={prod.productionId}>
                    <td>{prod.productionId}</td>
                    <td>{new Date(prod.timestamp).toLocaleString()}</td>
                    <td>{prod.energyKwh} kWh</td>
                    <td>{prod.dcVoltage} V</td>
                    <td>{prod.acVoltage} V</td>
                    <td>{prod.temperature} °C</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Sección Inversores --- */}
      <div className="users-table-container">
        <div className="section-header">
          <h3 style={{ color: 'white' }}>Inversores</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Potencia Máx (kW)</th>
                <th>Eficiencia (%)</th>
                <th>N° Serie</th>
                <th>Fecha Instalación</th>
              </tr>
            </thead>
            <tbody>
              {inverters.length > 0 ? (
                inverters.map((inv) => (
                  <tr key={inv.inverterId}>
                    <td>{inv.inverterId}</td>
                    <td>{inv.model}</td>
                    <td>{inv.maxPowerKw} kW</td>
                    <td>{inv.efficiency} %</td>
                    <td>{inv.serialNumber}</td>
                    <td>{new Date(inv.installationDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Sección Paneles Solares --- */}
      <div className="users-table-container">
        <div className="section-header">
          <h3 style={{ color: 'white' }}>Paneles Solares</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Potencia (W)</th>
                <th>Orientación</th>
                <th>Ángulo Inclinación</th>
                <th>Fecha Instalación</th>
              </tr>
            </thead>
            <tbody>
              {solarPanels.length > 0 ? (
                solarPanels.map((panel) => (
                  <tr key={panel.panelId}>
                    <td>{panel.panelId}</td>
                    <td>{panel.model}</td>
                    <td>{panel.powerRatingW} W</td>
                    <td>{panel.orientation}</td>
                    <td>{panel.tiltAngle}°</td>
                    <td>{new Date(panel.installationDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Sección Baterías --- */}
      <div className="users-table-container">
        <div className="section-header">
          <h3 style={{ color: 'white' }}>Baterías</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Capacidad (kWh)</th>
                <th>Eficiencia (%)</th>
                <th>Fecha Instalación</th>
              </tr>
            </thead>
            <tbody>
              {batteries.length > 0 ? (
                batteries.map((bat) => (
                  <tr key={bat.batteryId}>
                    <td>{bat.batteryId}</td>
                    <td>{bat.model}</td>
                    <td>{bat.capacityKwh} kWh</td>
                    <td>{bat.efficiency} %</td>
                    <td>{new Date(bat.installationDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Producción de Energía */}
      {showModalEnergy && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar' : 'Agregar'} Producción de Energía</h3>
            <form onSubmit={editingId ? 
              (e) => {
                e.preventDefault();
                handleSaveEdit('EnergyProduction', editingId, formEnergy, entityIdKeys.EnergyProduction);
              } : 
              handleAddEnergyProduction
            }>
              <div className="form-group">
                <label>Fecha y Hora:</label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={formEnergy.timestamp}
                  onChange={handleInputChange(setFormEnergy)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Energía (kWh):</label>
                <input
                  type="number"
                  name="energyKwh"
                  step="0.01"
                  min="0"
                  value={formEnergy.energyKwh}
                  onChange={handleInputChange(setFormEnergy)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Voltaje DC (V):</label>
                <input
                  type="number"
                  name="dcVoltage"
                  step="0.01"
                  min="0"
                  value={formEnergy.dcVoltage}
                  onChange={handleInputChange(setFormEnergy)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Voltaje AC (V):</label>
                <input
                  type="number"
                  name="acVoltage"
                  step="0.01"
                  min="0"
                  value={formEnergy.acVoltage}
                  onChange={handleInputChange(setFormEnergy)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Temperatura (°C):</label>
                <input
                  type="number"
                  name="temperature"
                  step="0.01"
                  value={formEnergy.temperature}
                  onChange={handleInputChange(setFormEnergy)}
                  required
                />
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalEnergy(false);
                    setEditingId(null);
                    setFormEnergy({ timestamp: '', energyKwh: '', dcVoltage: '', acVoltage: '', temperature: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Inversores */}
      {showModalInverter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar' : 'Agregar'} Inversor</h3>
            <form onSubmit={editingId ? 
              (e) => {
                e.preventDefault();
                handleSaveEdit('Inverters', editingId, formInverter, entityIdKeys.Inverters);
              } : 
              handleAddInverter
            }>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  name="model"
                  value={formInverter.model}
                  onChange={handleInputChange(setFormInverter)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Potencia Máx (kW):</label>
                <input
                  type="number"
                  name="maxPowerKw"
                  step="0.01"
                  min="0"
                  value={formInverter.maxPowerKw}
                  onChange={handleInputChange(setFormInverter)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Eficiencia (%):</label>
                <input
                  type="number"
                  name="efficiency"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formInverter.efficiency}
                  onChange={handleInputChange(setFormInverter)}
                  required
                />
              </div>
              <div className="form-group">
                <label>N° Serie:</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formInverter.serialNumber}
                  onChange={handleInputChange(setFormInverter)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha Instalación:</label>
                <input
                  type="date"
                  name="installationDate"
                  value={formInverter.installationDate}
                  onChange={handleInputChange(setFormInverter)}
                  required
                />
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalInverter(false);
                    setEditingId(null);
                    setFormInverter({ model: '', maxPowerKw: '', efficiency: '', serialNumber: '', installationDate: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Paneles Solares */}
      {showModalPanel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar' : 'Agregar'} Panel Solar</h3>
            <form onSubmit={editingId ? 
              (e) => {
                e.preventDefault();
                handleSaveEdit('SolarPanel', editingId, formPanel, entityIdKeys.SolarPanel);
              } : 
              handleAddPanel
            }>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  name="model"
                  value={formPanel.model}
                  onChange={handleInputChange(setFormPanel)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Potencia (W):</label>
                <input
                  type="number"
                  name="powerRatingW"
                  step="0.01"
                  min="0"
                  value={formPanel.powerRatingW}
                  onChange={handleInputChange(setFormPanel)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Orientación:</label>
                <input
                  type="text"
                  name="orientation"
                  value={formPanel.orientation}
                  onChange={handleInputChange(setFormPanel)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ángulo Inclinación (°):</label>
                <input
                  type="number"
                  name="tiltAngle"
                  step="0.01"
                  value={formPanel.tiltAngle}
                  onChange={handleInputChange(setFormPanel)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha Instalación:</label>
                <input
                  type="date"
                  name="installationDate"
                  value={formPanel.installationDate}
                  onChange={handleInputChange(setFormPanel)}
                  required
                />
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalPanel(false);
                    setEditingId(null);
                    setFormPanel({ model: '', powerRatingW: '', orientation: '', tiltAngle: '', installationDate: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Baterías */}
      {showModalBattery && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar' : 'Agregar'} Batería</h3>
            <form onSubmit={editingId ? 
              (e) => {
                e.preventDefault();
                handleSaveEdit('Battery', editingId, formBattery, entityIdKeys.Battery);
              } : 
              handleAddBattery
            }>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  name="model"
                  value={formBattery.model}
                  onChange={handleInputChange(setFormBattery)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacidad (kWh):</label>
                <input
                  type="number"
                  name="capacityKwh"
                  step="0.01"
                  min="0"
                  value={formBattery.capacityKwh}
                  onChange={handleInputChange(setFormBattery)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Eficiencia (%):</label>
                <input
                  type="number"
                  name="efficiency"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formBattery.efficiency}
                  onChange={handleInputChange(setFormBattery)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha Instalación:</label>
                <input
                  type="date"
                  name="installationDate"
                  value={formBattery.installationDate}
                  onChange={handleInputChange(setFormBattery)}
                  required
                />
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalBattery(false);
                    setEditingId(null);
                    setFormBattery({ model: '', capacityKwh: '', efficiency: '', installationDate: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantasInfoUser;