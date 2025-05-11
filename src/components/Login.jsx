import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Esta URL es de ejemplo y deberá ser reemplazada por la API real
      const response = await axios.post('http://localhost:5130/api/Auth/login', credentials);
      
      // Mostrar en consola la respuesta completa de la API
      console.log('Respuesta de la API:', response.data);
      
      const { token } = response.data;
      
      // Mostrar el token por consola
      console.log('Token recibido:', token);
      
      // Decodificar el token para obtener el rol
      const decodedToken = jwtDecode(token);
      
      // Mostrar el contenido del token decodificado en consola
      console.log('Token decodificado:', decodedToken);
      
      
      const role = decodedToken['Roll'];  // En backend se usó ClaimTypes.Role
      const username = decodedToken['Username'];  // En backend se usó ClaimTypes.Name
      const userId = decodedToken['UserId'];  // En backend usaste el claim "UserId"

      console.log('ROL:', role);  // Muestra el rol
      console.log('USERNAME:', username);  // Muestra el nombre de usuario
      console.log('USERID:', userId);  // Muestra el ID del usuario

      // Verificar que el rol sea válido
      if (role !== 'admin' && role !== 'user') {
        setError('Rol no válido');
        return;
      }

      // Guardar el token y el rol
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      setIsAuthenticated(true);

      // Redirigir según el rol
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
