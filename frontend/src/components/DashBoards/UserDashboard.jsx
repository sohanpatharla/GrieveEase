import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Button from '@mui/material/Button';
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Modal,
  Fade,
  Backdrop,
  FormControl,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 240;
const navItems = ['Home', 'About Us', 'Contact'];

function UserDashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    complaintId: '',
    complaintName: '',
    complaintContent: '',
    attachments: [],
    assignedTo: '',
    comments: '',
    status: 'Pending',
  });
  const [editComplaint, setEditComplaint] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      const complaintWithId = {
        ...newComplaint,
        complaintId: uuidv4(),
        createdBy: user,
      };
      const res = await api.post('/complaints/addComplaint', complaintWithId);
      setComplaints([...complaints, res.data]);
      resetComplaintForm();
      setError('');
       // Show success message
    setSnackbarMessage('Complaint submitted successfully');
    setOpenSnackbar(true);
    } catch (err) {
      console.error('Error adding complaint:', err);
      setError('Error adding complaint');
    }
  };

  const updateComplaint = async (id) => {
    console.log("Editing complaint");
    
    console.log(editComplaint);
    
    if (!editComplaint) {
      setError('Complaint details are required');
      return;
    }
    try {
      await api.put(`/complaints/updateComplaint/${id}`, editComplaint);
      fetchComplaints();
      setEditComplaint(null); // Close the modal
      setError('');
  // Show success message
  setSnackbarMessage('Complaint updated successfully');
  setOpenSnackbar(true);
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
    localStorage.removeItem('token');
    navigate('/');
  };

  const resetComplaintForm = () => {
    setNewComplaint({
      complaintId: '',
      complaintName: '',
      complaintContent: '',
      attachments: [],
      comments: '',
      status: 'Pending',
    });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" color="primary" position="fixed">
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GrieveEase
          </Typography>
          <Button sx={{ color: '#fff' }} onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Grid container spacing={3}>
          {/* Complaint Registration */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Register a Complaint
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Complaint Name"
                  name="complaintName"
                  value={newComplaint.complaintName}
                  onChange={handleComplaintChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  name="complaintContent"
                  multiline
                  rows={4}
                  value={newComplaint.complaintContent}
                  onChange={handleComplaintChange}
                />
                <FormControl fullWidth margin="normal">
                  <TextField
                    type="file"
                    name="attachments"
                    inputProps={{ multiple: true }}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        attachments: Array.from(e.target.files),
                      })
                    }
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={addComplaint}
                >
                  Submit Complaint
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              </CardContent>
            </Card>
          </Grid>

          {/* Complaints List */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Your Complaints
                </Typography>
                <List
                  sx={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    mt: 2,
                  }}
                >
                  {complaints.map((complaint) => (
                    <ListItem key={complaint._id} divider>
                      <Box sx={{ width: '100%' }}>
                      <Typography variant="body1"><strong>ID:</strong> {complaint.complaintId}</Typography>
                        <Typography variant="body1"><strong>Name:</strong> {complaint.complaintName}</Typography>
                        <Typography variant="body1"><strong>Description:</strong> {complaint.complaintContent}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {complaint.status}</Typography>
                        <Typography variant="body1"><strong>Category:</strong> {complaint.category || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Assigned To:</strong> {complaint.assignedTo || 'Employee not assigned'}</Typography>
                        <Typography variant="body1"><strong>Last Updated:</strong> {new Date(complaint.lastUpdated).toLocaleString()}</Typography>
                        <Typography variant="body1"><strong>Comments:</strong> {complaint.comments || 'No comments yet'}</Typography>
                        <Typography variant="body1"><strong>Created On:</strong> {new Date(complaint.createdOn).toLocaleString()}</Typography>
                        <Button
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={() => setEditComplaint(complaint)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Complaint Modal */}
        <Modal
          open={Boolean(editComplaint)}
          onClose={() => setEditComplaint(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={Boolean(editComplaint)}>
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400, bgcolor: 'background.paper', borderRadius: 2,
              boxShadow: 24, p: 4
            }}>
              <Typography variant="h6" component="h2">Edit Complaint</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Complaint Name"
                name="complaintName"
                value={editComplaint?.complaintName || ''}
                onChange={handleEditComplaintChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="complaintContent"
                multiline
                rows={4}
                value={editComplaint?.complaintContent || ''}
                onChange={handleEditComplaintChange}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => updateComplaint(editComplaint._id)}
              >
                Save Changes
              </Button>
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
          </Fade>
        </Modal>
      </Box>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>
    </Box>
   

  );
}

UserDashboard.propTypes = {
  window: PropTypes.func,
};

export default UserDashboard;
