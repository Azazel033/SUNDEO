import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link, Outlet } from 'react-router-dom';
import UsersTable from './admin/UsersTable';
import AccountInfo from './admin/AccountInfo';
import DataView from './admin/DataView';
import SolarPlants from './admin/SolarPlants';
import PlantasInfo from './admin/PlantasInfo';

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate('/');
    }
  };

  const toggleMenu = () => {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
  };

  return (
    <div>
      <nav className="navbar">
        <img src="./assets/icono.svg" alt="Icono" style={{ height: "40px", marginRight: "16px" }} />

        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
          <li><Link to="/admin-dashboard/usuarios">Editar/Agregar Usuarios</Link></li>
          <li><Link to="/admin-dashboard/datos">Consultar Datos</Link></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <div className="content">
        <center><h1>{username ? `Bienvenido a SUENDEO ${username}` : "Usuario no encontrado"}</h1></center>
        
        <Routes>
          <Route path="/cuenta" element={<AccountInfo />} />
          <Route path="/usuarios" element={<UsersTable />} />
          <Route path="/datos" element={<DataView />} />
          {/* <Route path="/plantas/:userId" element={<SolarPlants />} /> */}
          {/* <Route path="/plant-info/:plantId" element={<PlantasInfo />} /> */}

        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;