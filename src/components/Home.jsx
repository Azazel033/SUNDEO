import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ position: 'relative', height: '100vh', margin: 0, padding: 0 }}>

      {/* Navbar con solo el icono */}
      <nav className="navbar">
        <img src="/images/icono.svg" alt="Icono" style={{ height: "50px", marginRight: "16px" }} />
      </nav>

      {/* Contenedor centrado */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '500px',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          marginTop: '64px',  // para evitar que el contenido quede debajo del navbar
        }}
      >
        <h1 className="sundeo-font" style={{ color: '#333', marginBottom: '1.5rem' }}>
          Bienvenido a SUNDEO
        </h1>

        <p style={{ color: '#555', marginBottom: '2rem' }}>
          Plataforma de seguimiento para instalaciones de autoconsumo
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            transition: 'background 0.3s',
          }}
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default Home;
