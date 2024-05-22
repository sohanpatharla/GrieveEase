import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // default role is set to 'user'
  });
  const [error, setError] = useState(null);

  const { email, password, role } = formData;
  const navigate = useNavigate(); // Use useNavigate hook

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', res.data.token);
      // Navigate to appropriate route after login
      if (role === 'admin') {
        navigate('/admin'); // Navigate to '/admin' route after successful login
      } else if (role === 'employee') {
        navigate('/employee'); // Navigate to '/employee' route after successful login
      } else {
        navigate('/user'); // Navigate to '/user' route after successful login
      }
    } catch (error) {
      console.error(error);
      setError('Error logging in');
    }
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
              onChange={onChange}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={onChange}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={role === 'employee'}
              onChange={onChange}
            />
            Employee
          </label>
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
