// PlantasInfo.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
      setEnergyProductions(energyData);

      // Fetch Inverters
      const inverterRes = await fetch(`http://localhost:5130/api/Inverters/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const inverterData = await inverterRes.json();
      setInverters(inverterData);

      // Fetch Solar Panels
      const panelRes = await fetch(`http://localhost:5130/api/SolarPanel/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const panelData = await panelRes.json();
      setSolarPanels(panelData);

      // Fetch Batteries
      const batteryRes = await fetch(`http://localhost:5130/api/Battery/plant/${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  return (
    <div className="plant-info-container">
      <h2>Información de la Planta {plantId}</h2>
      
      {/* Energy Production Table */}
      <h3>Energy Production</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Energy (kWh)</th>
            <th>DC Voltage</th>
            <th>AC Voltage</th>
            <th>Temperature</th>
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

      {/* Inverters Table */}
      <h3>Inverters</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Max Power (kW)</th>
            <th>Efficiency</th>
            <th>Serial Number</th>
            <th>Installation Date</th>
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

      {/* Solar Panels Table */}
      <h3>Solar Panels</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Power Rating (W)</th>
            <th>Orientation</th>
            <th>Tilt Angle</th>
            <th>Installation Date</th>
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

      {/* Batteries Table */}
      <h3>Batteries</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Capacity (kWh)</th>
            <th>Efficiency</th>
            <th>Installation Date</th>
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
