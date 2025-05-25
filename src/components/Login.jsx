import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Solar3DScene } from './Solar3DScene';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5130/api/Auth/login', credentials);
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      const role = decodedToken['Roll'];
      const username = decodedToken['Username'];
      const userId = decodedToken['UserId'];

      if (role !== 'admin' && role !== 'user') {
        setError('Rol no válido');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);

      navigate(role === 'admin' ? '/admin-dashboard/usuarios' : '/user-dashboard/perfil');
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(error.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',  // Ocupa todo el alto de la pantalla
      margin: '0',
      padding: '0',
    }}>
      {/* Navbar con solo el icono */}
      <nav className="navbar">
        <img src="/images/icono.svg" alt="Icono" style={{ height: "50px", marginRight: "16px" }} />
      </nav>


      {/* Formulario de inicio de sesión */}
      <div style={{
        position: 'absolute',
        top: '50%',   // Centrado verticalmente
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centrado exacto
        width: '100%',
        maxWidth: '500px',  // Máximo ancho del formulario
        zIndex: 1,  // Formulario en el frente
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ 
          textAlign: 'center',
          color: '#333',
          marginBottom: '1.5rem'
        }}>
          Iniciar Sesión
        </h2>
        
        {error && (
          <div style={{
            color: 'white',
            background: '#ff4444',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#555'
            }}>
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#555'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
