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
       {/* Contenedor para el ícono y el botón de retroceso */}
        <div className="navbar-left">
          <img 
            src="/images/icono.svg" 
            alt="Icono" 
            style={{ height: "50px", marginRight: "16px", verticalAlign: 'middle' }} 
          />
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 16px',
              margin: '0',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
          <li><Link to="/admin-dashboard/usuarios">Gestion Usuarios</Link></li>
          <li><Link to="/admin-dashboard/datos">Consultar Datos</Link></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;