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
import TextField from '@mui/material/TextField'; // Material UI text field
import MenuItem from '@mui/material/MenuItem'; // Material UI dropdown
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom'; 
import '../DashBoards/EmployeeDashboard.css';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

function EmployeeDashboards(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
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
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  const drawer = (
    <Box onClick={() => setMobileOpen(false)} sx={{ textAlign: 'center' }}>
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3, width: '100%' }}>
        <Toolbar />
        <div className="employee-dashboard">
          <Typography variant="h4">Employee Dashboard</Typography>
          <Button variant="contained" color="error" onClick={handleLogout} sx={{ margin: '20px 0' }}>
            Logout
          </Button>

          <Typography variant="h5">Assigned Complaints</Typography>
          <ul>
            {complaints.map(complaint => (
              <li key={complaint.complaintId} onClick={() => handleComplaintSelect(complaint)}>
                {complaint.complaintName} - {complaint.status}
              </li>
            ))}
          </ul>

          {selectedComplaint && (
            <div className="complaint-details">
              <Typography variant="h6">Complaint Details</Typography>
              <p><strong>Name:</strong> {selectedComplaint.complaintName}</p>
              <p><strong>Content:</strong> {selectedComplaint.complaintContent}</p>
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>Resolution Time:</strong> {selectedComplaint.resolutionTime || 'Not resolved yet'}</p>
              <TextField
                label="Response"
                multiline
                rows={4}
                value={response}
                onChange={handleResponseChange}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Status"
                value={status}
                onChange={handleStatusChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
              <Button variant="contained" color="primary" onClick={handleUpdateComplaint}>
                Resolve Complaint
              </Button>
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
}

EmployeeDashboards.propTypes = {
  window: PropTypes.func,
};

export default EmployeeDashboards;
