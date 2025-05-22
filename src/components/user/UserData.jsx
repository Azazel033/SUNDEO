import { useState, useEffect } from 'react';
import api from '../../api';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

function UserData() {
  const [dailyTotals, setDailyTotals] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/EnergyProduction/user-daily/${userId}`);
      setDailyTotals(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const openChartModal = (data, title) => {
    setSelectedData(data);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const saveChartImage = () => {
    const chart = document.getElementById("chart");
    html2canvas(chart).then(canvas => {
      canvas.toBlob(blob => saveAs(blob, `${modalTitle}.png`));
    });
  };

  const chartData = {
    type: 'bar3d',
    x: selectedData.map(d => d.date),
    y: selectedData.map(d => d.totalEnergy),
    z: Array(selectedData.length).fill(0),
    marker: { color: 'rgb(75, 192, 192)', opacity: 0.6 },
    text: selectedData.map(d => `Producción: ${d.totalEnergy} kWh`),
    hoverinfo: 'text',
  };

  const chartLayout = {
    title: modalTitle,
    scene: {
      xaxis: { title: 'Fecha' },
      yaxis: { title: 'Producción (kWh)' },
      zaxis: { title: 'Nivel' }
    },
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 40
    }
  };

  return (
    <div className="data-view-container">
      <h2>Mis Datos de Producción</h2>
      <div className="data-table-container">
        <div className="table-header">
          <h3>Producción Total Diaria</h3>
          <div className="table-actions">
            <button onClick={() => openChartModal(dailyTotals, "Mi Producción")}>
              Ver Gráfico
            </button>
            <button onClick={() => downloadCSV(dailyTotals, "mi_produccion.csv")}>
              Exportar CSV
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total Energía (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {dailyTotals.map((d, i) => (
                <tr key={i}>
                  <td>{d.date}</td>
                  <td>{d.totalEnergy}</td>
                </tr>
              ))}
              {dailyTotals.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalTitle}</h2>
            <div id="chart">
              <Plot
                data={[chartData]}
                layout={chartLayout}
                config={{
                  displayModeBar: true,
                  scrollZoom: true,
                }}
              />
            </div>
            <div className="action-buttons">
              <button onClick={saveChartImage}>
                Guardar Imagen
              </button>
              <button onClick={() => setIsModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserData;