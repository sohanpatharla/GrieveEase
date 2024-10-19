import React from 'react';

const UserManagement = ({ users }) => {
  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
