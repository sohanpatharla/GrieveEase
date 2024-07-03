import React,{useState} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: 'user',
    name: '',
    mobileNumber: '12345678',
    role: 'user', // default role is set to 'user'
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { email, password, username, name, mobileNumber, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData);
        console.log('Response:', res); // Log the response for debugging
        localStorage.setItem('token', res.data.token);
        alert('User registered successfully');
        if (role === 'admin') {
          navigate('/admin'); // Navigate to '/admin' route after successful login
        } else if (role === 'employee') {
          navigate('/employee'); // Navigate to '/employee' route after successful login
        } else {
          navigate('/user'); // Navigate to '/user' route after successful login
        }
    } catch (error) {
        console.error('Error response:', error.response); // Log detailed error response
        setError('Error registering user');
    }
  };
  // const [state, setState] = React.useState({
  //   name: "",
  //   email: "",
  //   password: ""
  // });
  // const handleChange = evt => {
  //   const value = evt.target.value;
  //   setState({
  //     ...state,
  //     [evt.target.name]: value
  //   });
  // };

  // const handleOnSubmit = evt => {
  //   evt.preventDefault();

  //   const { name, email, password } = state;
  //   alert(
  //     `You are sign up with name: ${name} email: ${email} and password: ${password}`
  //   );

  //   for (const key in state) {
  //     setState({
  //       ...state,
  //       [key]: ""
  //     });
  //   }
  // };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={onSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
        />
        <button id="btnbtn">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
