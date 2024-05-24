import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className='container1'>
    <h1>Welcome to the Grievance Redressal System</h1>
    <div className="home-container">
     
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        
        <p>Login to Continue</p>
        <Link to="/login">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
        </Link>
      </div>
      <p style={{ textAlign: 'center' }}>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
    </div>
  );
};

export default Home;
