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
      <h2 style={{ color: 'white' }}> Datos de Producción</h2>

      <div className="tables-grid">
        {/* Producción Total Diaria */}
        <div className="table-card">
          <div className="table-header">
            <h3 className="text-lg font-semibold text-gray-700">Producción Total Diaria</h3>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => openChartModal(dailyTotals, "Mi Producción")}
              >
                Ver Gráfico
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => downloadCSV(dailyTotals, "mi_produccion.csv")}
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
                {dailyTotals.length === 0 && (
                  <tr>
                    <td colSpan="2" className="no-data">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mostrar total de registros */}
          <div className="total-records">
            <span>Total de registros: {dailyTotals.length}</span>
          </div>
        </div>
      </div>

      {/* Modal con gráfico */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
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
          </div>
        </div>
      )}

      <style jsx>{`
        .data-view-container {
          padding: 2rem;
          max-width: 1800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          flex-grow: 1;
          min-height: 0; /* Importante para evitar desplazamiento adicional */
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

        .table-scroll-container {
          overflow-y: auto;
          flex-grow: 1;
          max-height: 400px; /* Controlamos la altura de la tabla y el scroll solo se aplica a la tabla */
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f1f5f9;
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

        .total-records {
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          text-align: right;
          font-weight: 600;
          color: #334155;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 90%;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}

export default UserData;
