import React, { useState } from 'react';
// import { login } from '../../services/authService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // default role
  });

  const { email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onRoleChange = (e) => setFormData({ ...formData, role: e.target.value });

  const onSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   await login(formData);
    //   window.location.href = '/dashboard';
    // } catch (error) {
    //   console.error(error);
    //   alert('Error logging in');
    // }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
          placeholder="Password"
        />
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={onRoleChange}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={onRoleChange}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={role === 'employee'}
              onChange={onRoleChange}
            />
            Employee
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
