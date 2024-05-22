import React, { useState } from 'react';
// import { signup } from '../../services/authService';
import './Login.css';  // Reuse the same CSS file for styling consistency

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    mobileNumber: '',
  });

  const { email, password, username, mobileNumber } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   await signup(formData);
    //   alert('User registered successfully');
    //   window.location.href = '/login';  // Redirect to login page after successful signup
    // } catch (error) {
    //   console.error(error);
    //   alert('Error registering user');
    // }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
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
          name="mobileNumber"
          value={mobileNumber}
          onChange={onChange}
          placeholder="Mobile Number"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
