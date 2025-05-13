import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import SolarPlants from './components/admin/SolarPlants';
import PlantasInfo from './components/admin/PlantasInfo'; // Asegúrate de importar PlantasInfo

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Ruta para el Admin Dashboard */}
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="plantas/:userId" element={<SolarPlants />} />
        </Route>

        {/* Ruta para el User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRole="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* Nueva ruta para la información detallada de la planta */}
        <Route
          path="/plant-info/:plantId"
          element={
            <PrivateRoute allowedRole="admin"> {/* O el role que necesites */}
              <PlantasInfo />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
