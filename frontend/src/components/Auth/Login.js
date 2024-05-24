
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import lockIcon from './gp.png'; // Import your images accordingly
import notebookIcon from './complaint1.avif';

const LoginPage = () => 
  {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      role: 'user', // default role is set to 'user'
    });
    const [error, setError] = useState(null);
  
    const { email, password, role } = formData;
    const navigate = useNavigate(); // Use useNavigate hook
  
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async(e)=>
      {
        e.preventDefault( );
        try
        {
          const res = await axios.post('http://localhost:5000/api/users/login',formData);
          localStorage.setItem('token',res.data.token);
          if(role==="admin")
            navigate('/admin')
          else if (role === 'employee') {
            navigate('/employee'); // Navigate to '/employee' route after successful login
          } else {
            navigate('/user'); // Navigate to '/user' route after successful login
          }
        } 
        catch (error) {
          console.error(error);
          setError('Error logging in');
        }
      };

       
      
  //<img src={notebookIcon} alt="Notebook Icon" />
    return (
      <>
        
        <div className="container">
          
            <div className="image-container">
                <img src={lockIcon} alt="Lock Icon" />
               
            </div>
            <div>
            <h1>Login</h1>
            <form>
          
                <input type="email"  name ="email" placeholder="Email Address"  value ={email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password" value={password} onChange={onchange} required />
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
                <button className="button" type="submit">Submit</button>
                <div>
                    <a href="#">Forgot password?</a>
                </div>
                <div>
                    <a href="#">Don't have an account? Signup</a>
                </div>
                error && <p className="error-message">{error}</p>
            </form>
            </div>
            <div className="image-container2">
                <img src={notebookIcon} alt="Lock Icon" />
               
            </div>
        </div>
        </>
    );
};

export default LoginPage;
