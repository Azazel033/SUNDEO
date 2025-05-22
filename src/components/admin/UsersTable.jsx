import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function UsersTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterText, setFilterText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/Users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Users/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setShowModal(false);
      setFormData({
        username: '',
        password: '',
        email: '',
        role: 'user'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar el usuario. Por favor, intente nuevamente.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/Users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleInspectUser = (userId) => {
    navigate(`/admin-dashboard/cuenta?userId=${userId}`);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = [...users]
    .filter(user =>
      Object.values(user).some(value =>
        value?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="users-table-container">
      <h2>Gestión de Usuarios</h2>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>Agregar Usuario</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo Usuario</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

<input
        type="text"
        placeholder="Filtrar usuarios..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="filter-input"
      />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('username')}>
                Nombre {sortConfig.key === 'username' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('email')}>
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('createdAt')}>
                Fecha de Registro {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('role')}>
                Rol {sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.role}</td>
                <td><center>
                  <div className="tacion-buttons">
                    <button className="btn btn-secondary" onClick={() => handleInspectUser(user.userId)}>Inspeccionar</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user.userId)}>Eliminar</button>
                  </div>
                  </center>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;
