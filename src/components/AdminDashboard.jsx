import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';
import UsersTable from './admin/UsersTable';
import AccountInfo from './admin/AccountInfo';
import DataView from './admin/DataView';
import SolarPlants from './admin/SolarPlants'; 

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
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
          {/* <li><Link to="/admin-dashboard/cuenta">Cuenta</Link></li> */}
          <li><Link to="/admin-dashboard/usuarios">Editar/Agregar Usuarios</Link></li>
          <li><Link to="/admin-dashboard/datos">Consultar Datos</Link></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <div className="content">
        <h1>{username ? `Bienvenido a SUENDEO ${username}` : "Usuario no encontrado"}</h1>
        
        <Routes>
          <Route path="/cuenta" element={<AccountInfo />} />
          <Route path="/usuarios" element={<UsersTable />} />
          <Route path="/datos" element={<DataView />} />
          <Route path="/plantas/:userId" element={<SolarPlants />} />

        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;