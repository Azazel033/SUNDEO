import { useEffect, useState } from "react";
import api from '../../api';
const axios = api;
import Modal from "react-modal";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

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
      <h2 style={{ color: 'white' }}> Datos de Producción</h2>

      <div className="tables-grid">
        {/* Producción Total Diaria */}
        <div className="table-card">
          <div className="table-header">
            <div className="header-title">
              <h3 className="text-lg font-semibold">Producción Total Diaria</h3>
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => openChartModal(dailyTotals, "Producción Total")}
              >
                Ver Gráfico
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => downloadCSV(dailyTotals, "produccion_total.csv")}
              >
                Exportar CSV
              </button>
            </div>
          </div>
          <div className="table-scroll-container">
            <table className="data-table">
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Producción por Usuario */}
        <div className="table-card">
          <div className="table-header">
            <div className="header-title">
              <h3 className="text-lg font-semibold">Producción por Usuario</h3>
            </div>
            <div className="user-controls">
              <div className="user-input-group">
                <label className="text-sm text-gray-600">ID Usuario:</label>
                <input
                  type="number"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className="input-field"
                  placeholder="Ingrese ID"
                />
                <button
                  className="btn btn-primary"
                  onClick={handleUserFetch}
                >
                  Buscar
                </button>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => openChartModal(userDaily, `Usuario ${userId}`)}
                  disabled={!userDaily.length}
                >
                  Ver Gráfico
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => downloadCSV(userDaily, `produccion_usuario_${userId}.csv`)}
                  disabled={!userDaily.length}
                >
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>
          <div className="table-scroll-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total Energía (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {userDaily.length > 0 ? (
                  userDaily.map((d, i) => (
                    <tr key={i}>
                      <td>{d.date}</td>
                      <td>{d.totalEnergy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="no-data">
                      {userId ? "No se encontraron datos" : "Ingrese un ID de usuario"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal con gráfico */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
      >
        <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
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
        <div className="modal-actions">
          <button
            onClick={saveChartImage}
            className="btn btn-primary"
          >
            Guardar Imagen
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      <style jsx>{`
        .data-view-container {
          padding: 2rem;
          max-width: 1800px;
          margin: 0 auto;
          height: calc(100vh - 4rem);
          display: flex;
          flex-direction: column;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          flex-grow: 1;
          min-height: 0;
        }

        .table-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .table-header {
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          flex-shrink: 0;
        }

        .header-title {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .header-title h3 {
          margin: 0;
          line-height: 1.5;
        }

        .table-scroll-container {
          overflow-y: auto;
          flex-grow: 1;
          max-height: calc(100vh - 300px);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background-color: #9DD8F7;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #334155;
          position: sticky;
          top: 0;
        }

        .data-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #475569;
        }

        .data-table tr:hover {
          background-color: #f8fafc;
        }

        .no-data {
          text-align: center;
          color: #64748b;
          font-style: italic;
          padding: 2rem 0;
        }

        .user-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .user-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .input-field {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          max-width: 150px;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: flex-start;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          height: fit-content;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background-color: #2563eb;
        }

        .btn-secondary {
          background-color: #e2e8f0;
          color: #334155;
        }

        .btn-secondary:hover {
          background-color: #cbd5e1;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 1200px) {
          .tables-grid {
            grid-template-columns: 1fr;
          }

          .table-scroll-container {
            max-height: calc(50vh - 150px);
          }

          .user-controls {
            width: 100%;
            gap: 0.5rem;
          }

          .user-input-group {
            width: 100%;
          }

          .input-field {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default DataView;
