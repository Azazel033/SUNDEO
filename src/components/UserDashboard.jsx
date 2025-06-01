import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import UserProfile from './user/UserProfile';
import UserData from './user/UserData';
import { color } from 'chart.js/helpers';
import { Outlet } from 'react-router-dom';

function UserDashboard() {
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
      localStorage.removeItem("userId");
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
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Volver
          </button>
        </div>


        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
          <li><Link to="/user-dashboard/perfil">Mi Perfil</Link></li>
          <li><Link to={`/user-dashboard/plantas/${localStorage.getItem("userId")}`}>Mis Plantas</Link></li>
          <li><Link to="/user-dashboard/datos">Consultar Datos</Link></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <div className="content">
        <h1 style={{ color: 'white' }}>
          {username ? `Bienvenido a SUENDEO ${username}` : "Usuario no encontrado"}
        </h1>

        <Outlet />
      </div>
    </div>
  );
}

export default UserDashboard;