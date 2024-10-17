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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const drawerWidth = 240;
const navItems = [
  { text: 'Home', icon: <HomeIcon /> },
  { text: 'Assigned Complaints', icon: <AssignmentIcon /> },
  { text: 'Logout', icon: <LogoutIcon /> },
];

function EmployeeDashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/employee/assignedComplaints');
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints');
    }
  };

  const handleComplaintSelect = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.comments || '');
    setStatus(complaint.status || 'Pending');
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
        lastUpdated: new Date(),
      };
      await api.put(`/employee/updateComplaint/${selectedComplaint.complaintId}`, updatedComplaint);
      setComplaints(complaints.map(c => (c.complaintId === updatedComplaint.complaintId ? updatedComplaint : c)));
      setSelectedComplaint(updatedComplaint);
      setSnackbarMessage('Complaint updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating complaint');
      setSnackbarMessage('Failed to update the complaint.');
      setSnackbarOpen(true);
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
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              {item.icon}
              <ListItemText primary={item.text} sx={{ ml: 1 }} />
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GrieveEase
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Employee Dashboard
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Overview</Typography>
            <Typography variant="body1">
              You have {complaints.length} assigned complaints.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom>
          Assigned Complaints
        </Typography>
        <List>
          {complaints.map((complaint) => (
            <ListItem key={complaint.complaintId} sx={{ mb: 1 }}>
              <Card sx={{ width: '100%', p: 2 }}>
                <ListItemButton onClick={() => handleComplaintSelect(complaint)}>
                  <ListItemText
                    primary={complaint.complaintName}
                    secondary={`Status: ${complaint.status}`}
                  />
                  <Chip
                    label={complaint.status}
                    color={
                      complaint.status === 'Resolved'
                        ? 'success'
                        : complaint.status === 'Pending'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </ListItemButton>
              </Card>
            </ListItem>
          ))}
        </List>

        {selectedComplaint && (
          <Box mt={4} p={2} sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Complaint Details
            </Typography>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {selectedComplaint.complaintName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Content:</strong> {selectedComplaint.complaintContent}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Status:</strong> {selectedComplaint.status}
            </Typography>
            <TextField
              label="Response"
              multiline
              rows={4}
              value={response}
              onChange={handleResponseChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Status"
              value={status}
              onChange={handleStatusChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateComplaint}
              sx={{ mt: 2 }}
            >
              Resolve Complaint
            </Button>
          </Box>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

EmployeeDashboard.propTypes = {
  window: PropTypes.func,
};

export default EmployeeDashboard;
