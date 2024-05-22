import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-complaint" element={<AddComplaint />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
