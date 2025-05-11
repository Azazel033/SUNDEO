import React, { useState, useEffect } from "react";
import './AdminDashboard.css'; // Asumiré que tienes un archivo CSS para los estilos

const App = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Obtener el valor del 'username' desde el localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Mostrar un popup de confirmación
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
      // Eliminar el 'username' del localStorage
      localStorage.removeItem("username");

      // Redirigir al usuario a la página principal
      window.location.href = '/';  // Redirige a la página principal
    }
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
          <li><a href="#cuenta">Cuenta</a></li>
          <li><a href="#editar">Editar/Agregar Usuarios</a></li>
          <li><a href="#consultar">Consultar Datos</a></li>
          <li><a onClick={handleLogout} href="#">Cerrar Sesión</a></li> {/* Cambié href="#" para evitar comportamiento inesperado */}
        </ul>
      </nav>

      <div className="content">
        <h1>Bienvenido a SUENDEO</h1>
        <h2>{username ? `Hola, ${username}` : "Usuario no encontrado"}</h2>
      </div>
    </div>
  );
};

// Para manejar la visibilidad del menú en dispositivos pequeños
const toggleMenu = () => {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
};

export default App;
