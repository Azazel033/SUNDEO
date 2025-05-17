import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlantasInfo.css';

function PlantasInfo() {
  const { plantId } = useParams();
  const [inverters, setInverters] = useState([]);
  const [energyProductions, setEnergyProductions] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [batteries, setBatteries] = useState([]);

  // Estados para controlar modales
  const [showModalEnergy, setShowModalEnergy] = useState(false);
  const [showModalInverter, setShowModalInverter] = useState(false);
  const [showModalPanel, setShowModalPanel] = useState(false);
  const [showModalBattery, setShowModalBattery] = useState(false);

  // Form data states para cada modal
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

      // Energy Production
      const energyRes = await fetch(`http://localhost:5130/api/EnergyProduction/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const energyData = await energyRes.json();
      setEnergyProductions(energyData);

      // Inverters
      const inverterRes = await fetch(`http://localhost:5130/api/Inverters/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const inverterData = await inverterRes.json();
      setInverters(inverterData);

      // Solar Panels
      const panelRes = await fetch(`http://localhost:5130/api/SolarPanel/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const panelData = await panelRes.json();
      setSolarPanels(panelData);

      // Batteries
      const batteryRes = await fetch(`http://localhost:5130/api/Battery/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const batteryData = await batteryRes.json();
      setBatteries(batteryData);

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

  // Validación simple para campos vacíos
  const validateForm = (form) => {
    return Object.values(form).every(val => val !== '' && val !== null);
  };

  // Handlers para agregar registros
  const handleAddEnergyProduction = async (e) => {
    e.preventDefault();
    if (!validateForm(formEnergy)) {
      alert("Por favor completa todos los campos del formulario de Producción de Energía.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/EnergyProduction', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'text/plain'
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
        const errorText = await response.text();
        alert(`Error al agregar producción de energía: ${errorText}`);
      }
    } catch (error) {
      alert('Error en la solicitud: ' + error.message);
    }
  };

  const handleAddInverter = async (e) => {
    e.preventDefault();
    if (!validateForm(formInverter)) {
      alert("Por favor completa todos los campos del formulario de Inversores.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/Inverters', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'text/plain'
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
        const errorText = await response.text();
        alert(`Error al agregar inversor: ${errorText}`);
      }
    } catch (error) {
      alert('Error en la solicitud: ' + error.message);
    }
  };

  const handleAddPanel = async (e) => {
    e.preventDefault();
    if (!validateForm(formPanel)) {
      alert("Por favor completa todos los campos del formulario de Paneles Solares.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/SolarPanel', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'text/plain'
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
        const errorText = await response.text();
        alert(`Error al agregar panel solar: ${errorText}`);
      }
    } catch (error) {
      alert('Error en la solicitud: ' + error.message);
    }
  };

  const handleAddBattery = async (e) => {
    e.preventDefault();
    if (!validateForm(formBattery)) {
      alert("Por favor completa todos los campos del formulario de Baterías.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5130/api/Battery', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'text/plain'
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
        const errorText = await response.text();
        alert(`Error al agregar batería: ${errorText}`);
      }
    } catch (error) {
      alert('Error en la solicitud: ' + error.message);
    }
  };

  return (
    <div className="plant-info-container">
      <h2>Información de la Planta {plantId}</h2>

      {/* Producción de Energía */}
      <div className="section-header">
        <h3>Producción de Energía</h3>
        <button className="btn btn-primary" onClick={() => setShowModalEnergy(true)}>Agregar Producción</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de registro</th>
            <th>Energía (kWh)</th>
            <th>Voltaje DC</th>
            <th>Voltaje AC</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {energyProductions.length > 0 ? energyProductions.map((production) => (
            <tr key={production.productionId}>
              <td>{production.productionId}</td>
              <td>{new Date(production.timestamp).toLocaleString()}</td>
              <td>{production.energyKwh} kWh</td>
              <td>{production.dcVoltage} V</td>
              <td>{production.acVoltage} V</td>
              <td>{production.temperature} °C</td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal Producción de Energía */}
      {showModalEnergy && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Producción de Energía</h3>
            <form onSubmit={handleAddEnergyProduction} className="form-container">
              <div className="form-group">
                <label>Timestamp:</label>
                <input
                  type="datetime-local"
                  name="Fecha de registro"
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
                <button type="submit" className="btn btn-primary">Agregar</button>
                <button type="button" onClick={() => setShowModalEnergy(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inversores */}
      <div className="section-header">
        <h3>Inversores</h3>
        <button className="btn btn-primary" onClick={() => setShowModalInverter(true)}>Agregar Inversor</button>
      </div>
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
          {inverters.length > 0 ? inverters.map((inv) => (
            <tr key={inv.inverterId}>
              <td>{inv.inverterId}</td>
              <td>{inv.model}</td>
              <td>{inv.maxPowerKw} kW</td>
              <td>{inv.efficiency} %</td>
              <td>{inv.serialNumber}</td>
              <td>{new Date(inv.installationDate).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal Inversores */}
      {showModalInverter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Inversor</h3>
            <form onSubmit={handleAddInverter} className="form-container">
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
                <button type="submit" className="btn btn-primary">Agregar</button>
                <button type="button" onClick={() => setShowModalInverter(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paneles Solares */}
      <div className="section-header">
        <h3>Paneles Solares</h3>
        <button className="btn btn-primary" onClick={() => setShowModalPanel(true)}>Agregar Panel Solar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Potencia (W)</th>
            <th>Orientación</th>
            <th>Ángulo de Inclinación</th>
            <th>Fecha Instalación</th>
          </tr>
        </thead>
        <tbody>
          {solarPanels.length > 0 ? solarPanels.map((panel) => (
            <tr key={panel.panelId}>
              <td>{panel.panelId}</td>
              <td>{panel.model}</td>
              <td>{panel.powerRatingW} W</td>
              <td>{panel.orientation}</td>
              <td>{panel.tiltAngle}°</td>
              <td>{new Date(panel.installationDate).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal Paneles Solares */}
      {showModalPanel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Panel Solar</h3>
            <form onSubmit={handleAddPanel} className="form-container">
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
                <label>Ángulo de Inclinación (°):</label>
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
                <button type="submit" className="btn btn-primary">Agregar</button>
                <button type="button" onClick={() => setShowModalPanel(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Baterías */}
      <div className="section-header">
        <h3>Baterías</h3>
        <button className="btn btn-primary" onClick={() => setShowModalBattery(true)}>Agregar Batería</button>
      </div>
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
          {batteries.length > 0 ? batteries.map((bat) => (
            <tr key={bat.batteryId}>
              <td>{bat.batteryId}</td>
              <td>{bat.model}</td>
              <td>{bat.capacityKwh} kWh</td>
              <td>{bat.efficiency} %</td>
              <td>{new Date(bat.installationDate).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal Baterías */}
      {showModalBattery && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Batería</h3>
            <form onSubmit={handleAddBattery} className="form-container">
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
                <button type="submit" className="btn btn-primary">Agregar</button>
                <button type="button" onClick={() => setShowModalBattery(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PlantasInfo;
