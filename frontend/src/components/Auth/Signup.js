import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Corrected the CSS filename
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    name: '',
    mobileNumber: '',
    role: 'user',
  });
  // const [error, setError] = useState(null);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false); // Track signup success
  const navigate = useNavigate();

  const { email, password, username, name, mobileNumber, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('User registered successfully', {
        autoClose: 3000,
      });
      setIsSignUpSuccess(true); // Set signup success
      
    } catch (error) {
      console.error('Error response:', error.response);
      // setError('Error registering user');
      toast.error('Error registering user',);
    }
  };

  // Navigate to next page after successful signup and toast message
  if (isSignUpSuccess) {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'employee') {
      navigate('/employee');
    } else {
      navigate('/user');
    }
  }

  return (
    <div className="signup-container">
      <ToastContainer />
      <form className="signup-form" onSubmit={onSubmit}>
        <h2>Sign Up</h2>
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
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          required
          placeholder="Username"
        />
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
          placeholder="Name"
        />
        <input
          type="text"
          name="mobileNumber"
          value={mobileNumber}
          onChange={onChange}
          placeholder="Mobile Number"
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
        <button type="submit">Sign Up</button>
        {/* {error && <p className="error-message">{error}</p>} */}
      </form>
    </div>
  );
};

export default Signup;
