// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import './Login.css';


// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: 'user', // default role is set to 'user'
//   });
//   const [error, setError] = useState(null);

//   const { email, password, role } = formData;
//   const navigate = useNavigate(); // Use useNavigate hook

//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     console.log('In login');
//     e.preventDefault();
//     try {
//       console.log(`${process.env.REACT_APP_BACKEND_URL}`);
//       if (role === 'admin') {
//         const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, formData);
//       localStorage.setItem('token', res.data.token); // Navigate to '/admin' route after successful login
//       } else if (role === 'employee') {
//         const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/employee/login`, formData);
//       localStorage.setItem('token', res.data.token);
//       } else {
//         const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, formData);
//       localStorage.setItem('token', res.data.token);
//       }
      
//       // Navigate to appropriate route after login
//       if (role === 'admin') {
//         navigate('/admin'); // Navigate to '/admin' route after successful login
//       } else if (role === 'employee') {
//         navigate('/employee'); // Navigate to '/employee' route after successful login
//       } else {
//         navigate('/user'); // Navigate to '/user' route after successful login
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Error logging in');
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={onSubmit}>
//         <h2>Login</h2>
//         <input
//           type="email"
//           name="email"
//           value={email}
//           onChange={onChange}
//           required
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           name="password"
//           value={password}
//           onChange={onChange}
//           required
//           placeholder="Password"
//         />
//         <div className="role-selection">
//           <label>
//             <input
//               type="radio"
//               name="role"
//               value="user"
//               checked={role === 'user'}
//               onChange={onChange}
//             />
//             User
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="role"
//               value="admin"
//               checked={role === 'admin'}
//               onChange={onChange}
//             />
//             Admin
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="role"
//               value="employee"
//               checked={role === 'employee'}
//               onChange={onChange}
//             />
//             Employee
//           </label>
//         </div>
//         <button type="submit">Login</button>
//         {error && <p className="error-message">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react';
import api from '../../api'; // Import the axios instance
// import './UserDashboard.css'; // Custom styles if needed
import { useNavigate } from 'react-router-dom'; 
import '../DashBoards/UserDashboard.css';


const drawerWidth = 240;
const navItems = ['Home', 'About Us', 'Contact'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
      GrieveEase
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    complaintId: '',
    complaintName: '',
    complaintContent: '',
    priority: 'Medium',
    category: 'Technical',
    attachments: [],
    comments: '',
    createdOn: new Date(),
    status: 'Pending',
    lastUpdated: new Date(),
    assignedTo: '',
  });
  const [editComplaint, setEditComplaint] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Assuming user info is stored here

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Error fetching complaints');
    }
  };

  const addComplaint = async () => {
    try {
      const res = await api.post('/complaints/addComplaint', { ...newComplaint, createdBy: user });
      setComplaints([...complaints, res.data]);
      setNewComplaint({
        complaintId: '',
        complaintName: '',
        complaintContent: '',
        priority: 'Medium',
        category: 'Technical',
        attachments: [],
        comments: '',
        createdOn: new Date(),
        status: 'Pending',
        lastUpdated: new Date(),
        assignedTo: '',
      });
      setError('');
    } catch (err) {
      console.error('Error adding complaint:', err);
      setError('Error adding complaint');
    }
  };

  const updateComplaint = async (id) => {
    if (!editComplaint) {
      setError('Complaint details are required');
      return;
    }

    try {
      await api.put(`/complaints/${id}`, editComplaint);
      fetchComplaints();
      setEditComplaint(null);
      setError('');
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError('Error updating complaint');
    }
  };

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleEditComplaintChange = (e) => {
    const { name, value } = e.target;
    setEditComplaint({ ...editComplaint, [name]: value });
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to login page
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            GrieveEase
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
      <div className="container border-bottom scrollarea">
      <h1 className="my-4">User Dashboard</h1>
      <button className="btn btn-danger logout-button" onClick={handleLogout}>Logout</button> 


      <div className="card mb-4">
        <div className="card-header">
          <h2>Add Complaint</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="complaintId" className="form-label">Complaint ID</label>
            <input
              type="text"
              className="form-control"
              id="complaintId"
              name="complaintId"
              value={newComplaint.complaintId}
              onChange={handleComplaintChange}
              placeholder="Complaint ID"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="complaintName" className="form-label">Complaint Name</label>
            <input
              type="text"
              className="form-control"
              id="complaintName"
              name="complaintName"
              value={newComplaint.complaintName}
              onChange={handleComplaintChange}
              placeholder="Complaint Name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="complaintContent" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="complaintContent"
              name="complaintContent"
              value={newComplaint.complaintContent}
              onChange={handleComplaintChange}
              placeholder="Description"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <input
              type="text"
              className="form-control"
              id="priority"
              name="priority"
              value={newComplaint.priority}
              onChange={handleComplaintChange}
              placeholder="Priority"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={newComplaint.category}
              onChange={handleComplaintChange}
              placeholder="Category"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comments" className="form-label">Comments</label>
            <input
              type="text"
              className="form-control"
              id="comments"
              name="comments"
              value={newComplaint.comments}
              onChange={handleComplaintChange}
              placeholder="Comments"
            />
          </div>
          <button className="btn btn-primary" onClick={addComplaint}>Add Complaint</button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h2>Your Complaints</h2>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="list-group-item">
                <div className="complaint-info">
                  <div><strong>ID:</strong> {complaint.complaintId}</div>
                  <div><strong>Name:</strong> {complaint.complaintName}</div>
                  <div><strong>Description:</strong> {complaint.complaintContent}</div>
                  <div><strong>Priority:</strong> {complaint.priority}</div>
                  <div><strong>Category:</strong> {complaint.category}</div>
                  <div><strong>Comments:</strong> {complaint.comments}</div>
                  <div><strong>Status:</strong> {complaint.status}</div>
                  <div><strong>Last Updated:</strong> {new Date(complaint.lastUpdated).toLocaleString()}</div>
                </div>
                <button className="btn btn-secondary mt-2" onClick={() => setEditComplaint(complaint)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {editComplaint && (
        <div className="card">
          <div className="card-header">
            <h2>Edit Complaint</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="editComplaintName" className="form-label">Complaint Name</label>
              <input
                type="text"
                className="form-control"
                id="editComplaintName"
                name="complaintName"
                value={editComplaint.complaintName}
                onChange={handleEditComplaintChange}
                placeholder="Complaint Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editComplaintContent" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="editComplaintContent"
                name="complaintContent"
                value={editComplaint.complaintContent}
                onChange={handleEditComplaintChange}
                placeholder="Description"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="editPriority" className="form-label">Priority</label>
              <input
                type="text"
                className="form-control"
                id="editPriority"
                name="priority"
                value={editComplaint.priority}
                onChange={handleEditComplaintChange}
                placeholder="Priority"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editCategory" className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                id="editCategory"
                name="category"
                value={editComplaint.category}
                onChange={handleEditComplaintChange}
                placeholder="Category"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editComments" className="form-label">Comments</label>
              <input
                type="text"
                className="form-control"
                id="editComments"
                name="comments"
                value={editComplaint.comments}
                onChange={handleEditComplaintChange}
                placeholder="Comments"
              />
            </div>
            <button className="btn btn-primary" onClick={() => updateComplaint(editComplaint._id)}>Update Complaint</button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
        </div>
      )}
    </div>
       
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
