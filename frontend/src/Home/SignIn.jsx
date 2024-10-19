import React,{ useState }  from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '@fortawesome/fontawesome-free/css/all.min.css';


function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // default role is set to 'user'
  });
  // const [state, setState] = React.useState({
  //   email: "",
  //   password: ""
  // });

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const navigate = useNavigate(); // Use useNavigate hook

  const { email, password, role } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    console.log('In login');
    e.preventDefault();
    try {
      console.log(import.meta.env);

      console.log(import.meta.env.VITE_APP_BACKEND_URL);
      if (role === 'admin') {
        const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/login`, formData);
      localStorage.setItem('token', res.data.token); // Navigate to '/admin' route after successful login
      } else if (role === 'employee') {
        const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/employee/login`, formData);
      localStorage.setItem('token', res.data.token);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/users/login`, formData);
      localStorage.setItem('token', res.data.token);
      }
      
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
  // const handleChange = evt => {
  //   const value = evt.target.value;
  //   setState({
  //     ...state,
  //     [evt.target.name]: value
  //   });
  // };

  // const handleOnSubmit = evt => {
  //   evt.preventDefault();

  //   const { email, password } = state;
  //   alert(`You are login with email: ${email} and password: ${password}`);

  //   for (const key in state) {
  //     setState({
  //       ...state,
  //       [key]: ""
  //     });
  //   }
  // };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="/" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="/" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="/" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          required
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          required
          onChange={onChange}
        />
  
      <FormLabel id="demo-row-radio-buttons-group-label">Role</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="user" control={<Radio />} label="User" name="role" checked={role === 'user'} onChange={onChange}/>
        <FormControlLabel value="employee" control={<Radio />} label="Employee" name="role" checked={role === 'employee'} onChange={onChange}/>
        <FormControlLabel value="admin" control={<Radio />} label="Admin" name="role" checked={role === 'admin'} onChange={onChange}/>
      </RadioGroup>
    
        <a href="/">Forgot your password?</a>
        <button className="loginBtn">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
