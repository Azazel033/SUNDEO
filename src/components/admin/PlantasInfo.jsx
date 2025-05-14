import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlantasInfo.css';

function PlantasInfo() {
  const { plantId } = useParams();
  const [inverters, setInverters] = useState([]);
  const [energyProductions, setEnergyProductions] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [batteries, setBatteries] = useState([]);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch Energy Production
      const energyRes = await fetch(`http://localhost:5130/api/EnergyProduction/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const energyData = await energyRes.json();
      console.log('Energy Production Data:', energyData); // Log the energy production data
      setEnergyProductions(energyData);

      // Fetch Inverters
      const inverterRes = await fetch(`http://localhost:5130/api/Inverters/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const inverterData = await inverterRes.json();
      console.log('Inverters Data:', inverterData); // Log the inverters data
      setInverters(inverterData);

      // Fetch Solar Panels
      const panelRes = await fetch(`http://localhost:5130/api/SolarPanel/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const panelData = await panelRes.json();
      console.log('Solar Panels Data:', panelData); // Log the solar panels data
      setSolarPanels(panelData);

      // Fetch Batteries
      const batteryRes = await fetch(`http://localhost:5130/api/Battery/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const batteryData = await batteryRes.json();
      console.log('Batteries Data:', batteryData); // Log the batteries data
      setBatteries(batteryData);

    } catch (error) {
      console.error('Error al obtener los dispositivos:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [plantId]);

  return (
    <div className="plant-info-container">
      <h2>Información de la Planta {plantId}</h2>
      
      <h3>Producción de Energía</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Energía (kWh)</th>
            <th>Voltaje DC</th>
            <th>Voltaje AC</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {energyProductions.map((production) => (
            <tr key={production.productionId}>
              <td>{production.productionId}</td>
              <td>{new Date(production.timestamp).toLocaleString()}</td>
              <td>{production.energyKwh} kWh</td>
              <td>{production.dcVoltage} V</td>
              <td>{production.acVoltage} V</td>
              <td>{production.temperature} °C</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Inversores</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Potencia Máxima (kW)</th>
            <th>Eficiencia</th>
            <th>Número de Serie</th>
            <th>Fecha de Instalación</th>
          </tr>
        </thead>
        <tbody>
          {inverters.map((inverter) => (
            <tr key={inverter.inverterId}>
              <td>{inverter.inverterId}</td>
              <td>{inverter.model}</td>
              <td>{inverter.maxPowerKw} kW</td>
              <td>{inverter.efficiency}</td>
              <td>{inverter.serialNumber}</td>
              <td>{new Date(inverter.installationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Paneles Solares</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Potencia (W)</th>
            <th>Orientación</th>
            <th>Ángulo de Inclinación</th>
            <th>Fecha de Instalación</th>
          </tr>
        </thead>
        <tbody>
          {solarPanels.map((panel) => (
            <tr key={panel.panelId}>
              <td>{panel.panelId}</td>
              <td>{panel.model}</td>
              <td>{panel.powerRatingW} W</td>
              <td>{panel.orientation}</td>
              <td>{panel.tiltAngle}°</td>
              <td>{new Date(panel.installationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Baterías</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Capacidad (kWh)</th>
            <th>Eficiencia</th>
            <th>Fecha de Instalación</th>
          </tr>
        </thead>
        <tbody>
          {batteries.map((battery) => (
            <tr key={battery.batteryId}>
              <td>{battery.batteryId}</td>
              <td>{battery.model}</td>
              <td>{battery.capacityKwh} kWh</td>
              <td>{battery.efficiency}</td>
              <td>{new Date(battery.installationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlantasInfo;
