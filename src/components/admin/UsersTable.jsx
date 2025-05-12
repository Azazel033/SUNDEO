import { useState, useEffect } from 'react';
import axios from 'axios';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5130/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Usuarios recibidos:', response.data); // Para debug
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5130/api/Users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="users-table-container">
      <h2>Gestión de Usuarios</h2>
      <input
        type="text"
        placeholder="Filtrar usuarios..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="filter-input"
      />
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
              <td>
                <button onClick={() => handleDeleteUser(user.userId)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
