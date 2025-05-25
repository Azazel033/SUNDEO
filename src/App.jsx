import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import SolarPlants from './components/admin/SolarPlants';
import PlantasInfo from './components/admin/PlantasInfo';
import AccountInfo from './components/admin/AccountInfo';
import UsersTable from './components/admin/UsersTable';
import DataView from './components/admin/DataView';
import { Solar3DScene } from './components/Solar3DScene';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
      return <Navigate to="/login" />;
    }

    if (userRole !== allowedRole) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Router>
      {/* Fondo animado persistente */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Solar3DScene />
      </div>

      {/* Contenido de la aplicación encima del fondo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

          <Route
            path="/admin-dashboard/*"
            element={
              <PrivateRoute allowedRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route path="cuenta" element={<AccountInfo />} />
            <Route path="usuarios" element={<UsersTable />} />
            <Route path="datos" element={<DataView />} />
            <Route path="plantas/:userId" element={<SolarPlants />} />
            <Route path="plant-info/:plantId" element={<PlantasInfo />} />
          </Route>

          <Route
            path="/user-dashboard/*"
            element={
              <PrivateRoute allowedRole="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
