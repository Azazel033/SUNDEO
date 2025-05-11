import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido al Sistema</h1>
      <p>Sistema de gestión de usuarios y administración</p>
      <Link to="/login" className="login-button">
        Iniciar Sesión
      </Link>
    </div>
  );
}

export default Home;