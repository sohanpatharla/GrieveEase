import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'
const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Grievance Redressal System</h1>
      <p>Please log in or sign up to continue</p>
      <div>
        <Link to="/login">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
