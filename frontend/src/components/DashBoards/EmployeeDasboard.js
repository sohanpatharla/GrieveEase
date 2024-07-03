

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

import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../DashBoards/EmployeeDashboard.css';
import { useNavigate } from 'react-router-dom'; 


const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

function EmployeeDashboards(props) {
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
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      console.log(`Going to fetch complaints`);
      const res = await api.get('/employee/assignedComplaints');
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleComplaintSelect = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.comments || '');
    setStatus(complaint.status || '');
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUpdateComplaint = async () => {
    try {
      const updatedComplaint = {
        ...selectedComplaint,
        comments: response,
        status,
        lastUpdated: new Date()
      };
      await api.put(`/employee/updateComplaint/${selectedComplaint.complaintId}`, updatedComplaint);
      setComplaints(complaints.map(c => (c.complaintId === updatedComplaint.complaintId ? updatedComplaint : c)));
      setSelectedComplaint(updatedComplaint);
      alert('Complaint updated successfully!');
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
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
        <Toolbar />
        <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      <button className="btn btn-danger logout-button" onClick={handleLogout}>Logout</button>

      <div className="complaint-list">
        <h2>Assigned Complaints</h2>
        <ul>
          {complaints.map(complaint => (
            <li key={complaint.complaintId} onClick={() => handleComplaintSelect(complaint)}>
              {complaint.complaintName} - {complaint.status}
            </li>
          ))}
        </ul>
      </div>
      {selectedComplaint && (
        <div className="complaint-details">
          <h2>Complaint Details</h2>
          <p><strong>ID:</strong> {selectedComplaint.complaintId}</p>
          <p><strong>Name:</strong> {selectedComplaint.complaintName}</p>
          <p><strong>Description:</strong> {selectedComplaint.description}</p>
          <p><strong>Created On:</strong> {new Date(selectedComplaint.createdOn).toLocaleString()}</p>
          <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
          <p><strong>Category:</strong> {selectedComplaint.category}</p>
          <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo?.name}</p>
          <p><strong>Last Updated:</strong> {new Date(selectedComplaint.lastUpdated).toLocaleString()}</p>
          <p><strong>Status:</strong> {selectedComplaint.status}</p>
          <p><strong>Attachments:</strong></p>
          <ul>
            {selectedComplaint.attachments.map((file, index) => (
              <li key={index}><a href={file} target="_blank" rel="noopener noreferrer">Attachment {index + 1}</a></li>
            ))}
          </ul>
          <div className="update-section">
            <h3>Update Complaint</h3>
            <textarea
              value={response}
              onChange={handleResponseChange}
              placeholder="Add your response here..."
            ></textarea>
            <select value={status} onChange={handleStatusChange}>
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={handleUpdateComplaint}>Resolve Complaint</button>
          </div>
        </div>
      )}
    </div>
      </Box>
    </Box>
  );
}


export default EmployeeDashboards;
