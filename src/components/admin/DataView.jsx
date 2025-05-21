import { useEffect, useState } from "react";
import api from '../../api';
const axios = api;
import Modal from "react-modal";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import './DataView.css';

Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width: '90%',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

function DataView() {
  const [dailyTotals, setDailyTotals] = useState([]);
  const [userDaily, setUserDaily] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("/EnergyProduction/daily-totals")
      .then(res => setDailyTotals(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUserFetch = () => {
    if (!userId) return;
    axios.get(`/EnergyProduction/user-daily/${userId}`)
      .then(res => setUserDaily(res.data))
      .catch(err => {
        setUserDaily([]);
        console.error(err);
      });
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
    type: 'bar3d',  // Cambiar a barras 3D
    x: selectedData.map(d => d.date),  // Usar fechas como etiquetas en X
    y: selectedData.map(d => d.totalEnergy),  // Producción de energía en Y
    z: Array(selectedData.length).fill(0),  // Agregar una capa Z que mantenga la base
    marker: { color: 'rgb(75, 192, 192)', opacity: 0.6 },
    text: selectedData.map(d => `Producción: ${d.totalEnergy} kWh`),  // Agregar texto interactivo
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
      <h2 className="data-view-title">Consulta de Datos</h2>

      <div className="tables-container">
        {/* Producción Total Diaria */}
        <div className="data-table-container">
          <div className="table-header">
            <h3>Producción Total Diaria</h3>
            <div className="table-actions">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => openChartModal(dailyTotals, "Producción Total")}
              >
                Ver Gráfico
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => downloadCSV(dailyTotals, "produccion_total.csv")}
              >
                Exportar CSV
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr className="bg-gray-100">
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Producción por Usuario */}
        <div className="data-table-container">
          <div className="table-header">
            <h3>Producción por Usuario</h3>
            <div className="user-controls">
              <div className="user-input-group">
                <label>ID Usuario:</label>
                <input
                  type="number"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                />
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  onClick={handleUserFetch}
                >
                  Buscar
                </button>
              </div>
              <div className="table-actions">
                <button 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  onClick={() => openChartModal(userDaily, `Usuario ${userId}`)}
                  disabled={!userDaily.length}
                >
                  Gráfico
                </button>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  onClick={() => downloadCSV(userDaily, `produccion_usuario_${userId}.csv`)}
                  disabled={!userDaily.length}
                >
                  CSV
                </button>
              </div>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr className="bg-gray-100">
                  <th>Fecha</th>
                  <th>Total Energía (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {userDaily.map((d, i) => (
                  <tr key={i}>
                    <td>{d.date}</td>
                    <td>{d.totalEnergy}</td>
                  </tr>
                ))}
                {userDaily.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center text-gray-500 italic">
                      {userId ? "No se encontraron datos" : "Ingrese un ID de usuario"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal con gráfico de barras 3D */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        style={customModalStyles}
      >
        <h2>{modalTitle}</h2>
        <div id="chart">
          <Plot
            data={[chartData]}
            layout={chartLayout}
            config={{
              displayModeBar: true,  // Para habilitar la barra de herramientas con opciones como zoom y rotación
              scrollZoom: true,      // Habilitar zoom con scroll
            }}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={saveChartImage} 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Guardar Imagen
          </button>
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default DataView;
