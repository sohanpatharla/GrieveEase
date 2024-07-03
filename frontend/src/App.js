//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

import DrawerAppBar from './components/DashBoards/UserDashboard';
import AdminDashboard from './components/DashBoards/AdminDashboard';
import EmployeeDashboards from './components/DashBoards/EmployeeDasboard';
import LandingPage from './Home/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginpage" element={<LandingPage/>} />

        <Route path="/user" element={<DrawerAppBar />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboards />} />
        {/* <Route path="/add-complaint" element={<AddComplaint />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
