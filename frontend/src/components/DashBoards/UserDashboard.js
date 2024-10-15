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
import Button from '@mui/material/Button';
import { TextField, Card, CardContent, Grid, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api'; // Axios instance for backend API calls
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Use UUID for unique IDs (install using npm: npm install uuid)


const drawerWidth = 240;
const navItems = ['Home', 'About Us', 'Contact'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    complaintId: '',
    complaintName: '',
    complaintContent: '',
    priority: 'Medium',
    category: 'Technical',
    attachments: [],
    comments: '',
    status: 'Pending',
  });
  const [editComplaint, setEditComplaint] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); 
  const navigate = useNavigate(); 

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

 
  // Function to add a new complaint
  const addComplaint = async () => {
    try {
      const complaintWithId = {
        ...newComplaint,
        complaintId: uuidv4(), // Automatically generate a unique complaint ID
        createdBy: user, // Ensure 'createdBy' is populated as well
      };
  
      const res = await api.post('/complaints/addComplaint', complaintWithId);
      setComplaints([...complaints, res.data]);
      resetComplaintForm();
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
    localStorage.removeItem('token');
    navigate('/');
  };

  const resetComplaintForm = () => {
    setNewComplaint({
      complaintId: '',
      complaintName: '',
      complaintContent: '',
      priority: 'Medium',
      category: 'Technical',
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Register a Complaint</Typography>
                <Box component="form" sx={{ mt: 2 }}>
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
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={newComplaint.priority}
                      onChange={handleComplaintChange}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={newComplaint.category}
                      onChange={handleComplaintChange}
                    >
                      <MenuItem value="Technical">Technical</MenuItem>
                      <MenuItem value="Billing">Billing</MenuItem>
                      <MenuItem value="Service">Service</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={addComplaint}>
                    Submit Complaint
                  </Button>
                  {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Your Complaints</Typography>
                <List sx={{ mt: 2 }}>
                  {complaints.map((complaint) => (
                    <ListItem key={complaint._id}>
                      <Box>
                        <Typography variant="body1"><strong>ID:</strong> {complaint.complaintId}</Typography>
                        <Typography variant="body1"><strong>Name:</strong> {complaint.complaintName}</Typography>
                        <Typography variant="body1"><strong>Description:</strong> {complaint.complaintContent}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {complaint.status}</Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditComplaint(complaint)}>
                          Edit
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {editComplaint && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Edit Complaint</Typography>
                  <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Complaint Name"
                      name="complaintName"
                      value={editComplaint.complaintName}
                      onChange={handleEditComplaintChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Description"
                      name="complaintContent"
                      multiline
                      rows={4}
                      value={editComplaint.complaintContent}
                      onChange={handleEditComplaintChange}
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => updateComplaint(editComplaint._id)}>
                      Update Complaint
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
