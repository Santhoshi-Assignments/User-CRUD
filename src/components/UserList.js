import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    axios.post('https://jsonplaceholder.typicode.com/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '' });
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find(user => user.id === userId);
    setNewUser({ name: userToEdit.name, email: userToEdit.email });
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map(user => {
      if (user.id === editingUserId) {
        return { ...user, name: newUser.name, email: newUser.email };
      }
      return user;
    });

    setUsers(updatedUsers);
    setEditingUserId(null);
    setNewUser({ name: '', email: '' });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(() => setUsers(users.filter(user => user.id !== userId)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleEditUser(user.id)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        {editingUserId ? (
          <>
            <h2>Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            <button onClick={handleUpdateUser}>Update User</button>
          </>
        ) : (
          <>
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            <button onClick={handleAddUser}>Add User</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
