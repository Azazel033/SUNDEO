import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './UserDashboard.css';
import UserProfile from './user/UserProfile';
import UserData from './user/UserData';

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
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
          <li><Link to="/user-dashboard/perfil">Ver Perfil</Link></li>
          <li><Link to="/user-dashboard/datos">Consultar Datos</Link></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <div className="content">
        <h1>{username ? `Bienvenido a SUENDEO ${username}` : "Usuario no encontrado"}</h1>
        
        <Routes>
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/datos" element={<UserData />} />
        </Routes>
      </div>
    </div>
  );
}

export default UserDashboard;