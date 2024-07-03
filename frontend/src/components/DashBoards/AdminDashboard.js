import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import {
  AppBar, Tabs, Tab, Box, Typography, Button, Grid, Card, CardContent, Snackbar, IconButton,TextField,List, ListItem, ListItemText
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import api from '../../api';
import ComplaintStatusOverview from './ComplaintStatusOverview';
import ComplaintsOverTime from "./ComplaintsOverTime";
import { useNavigate } from 'react-router-dom'; 
import {
  CardActions,
} from '@mui/material';

// import ComplaintStatusChart from './ComplaintStatusChart';
// import ComplaintTimeChart from './ComplaintTimeChart';
// import ComplaintCategoryChart from './ComplaintCategoryChart';
// import ComplaintPriorityChart from './ComplaintPriorityChart';
const ComplaintCard = ({ complaint, handleAssignComplaint }) => (
  <Card sx={{ minWidth: 275, mb: 2 }}>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Complaint ID: {complaint.complaintId}
      </Typography>
      <Typography variant="h5" component="div">
        {complaint.complaintName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Status: {complaint.status}
      </Typography>
      <Typography variant="body2">
        Description: {complaint.complaintContent}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => handleAssignComplaint(complaint._id)}>
        Assign
      </Button>
    </CardActions>
  </Card>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fetchedComplaint, setFetchedComplaint] = useState(null);
  const [showAssignField, setShowAssignField] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchUsers();
    await fetchComplaints();
    await fetchOpenComplaints();
    await fetchClosedComplaints();
    await fetchEmployees();
    await fetchAnalytics();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage("");
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/users/profiles`);
      console.log("Fetched users:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  const fetchComplaint = async () => {
    try {
      const { id } = formData;
      console.log(formData)
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/complaint/${id}`);
      setFetchedComplaint(res.data);
      setMessage("Complaint fetched successfully!");
    } catch (error) {
      console.error("Error fetching complaint:", error.response || error.message);
      setMessage("Error fetching complaint");
    }
  }

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/complaints`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchOpenComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/openStatus`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching open complaints:", error);
    }
  };

  const fetchClosedComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/closedStatus`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching closed complaints:", error);
    }
  };

  const handleDeleteComplaint = async () => {
    try {
      const { id } = formData;
      console.log(formData)
      await api.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/delete/${id}`);
      setFetchedComplaint(null);
      setMessage("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error.response || error.message);
      setMessage("Error deleting complaint");
    }
  }

  const fetchEmployees = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`);
      const data = res.data;
      setStatusData([
        { name: 'Pending', value: data.pending },
        { name: 'In Progress', value: data.inProgress },
        { name: 'Resolved', value: data.resolved },
        { name: 'Rejected', value: data.rejected }
      ]);
      setTimeData(data.timeData); // Assuming timeData is an array of {name: 'date', count: number}
      setCategoryData(data.categoryData); // Assuming categoryData is an array of {name: 'category', count: number}
      setPriorityData(data.priorityData); // Assuming priorityData is an array of {name: 'priority', count: number}
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${process.env.REACT_APP_BACKEND_URL}/admin/addEmployee`, formData);
      setMessage("Employee added successfully!");
      fetchEmployees();
    } catch (error) {
      setMessage("Error adding employee");
      console.error("Error adding employee:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    const { employeeId, ...updateData } = formData;
    console.log(formData);
    console.log(`this is the id${employeeId}`);
    try {
      await api.put(`${process.env.REACT_APP_BACKEND_URL}/admin/updateEmployee/${employeeId}`, updateData);
      setMessage("Employee updated successfully!");
      setFormData({});
    } catch (error) {
      setMessage("Error updating employee");
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async () => {
    const { employeeId } = formData;
    try {
      await api.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteEmployee/${employeeId}`);
      setMessage("Employee deleted successfully!");
    } catch (error) {
      setMessage("Error deleting employee");
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = formData;
      await api.put(`${process.env.REACT_APP_BACKEND_URL}/admin/updateComplaint/${id}`, updateData);
      setMessage("Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating complaint:", error.response || error.message);
      setMessage("Error updating complaint");
    }
  };

  const mapfield = () => {
    setShowAssignField(true);
  }

  const handleMapComplaint = async (e) => {
    e.preventDefault();
    const { id } = formData;
    try {
      await api.post(`${process.env.REACT_APP_BACKEND_URL}/admin/mapComplaint/${id}`, { assignedTo: employeeName });
      setMessage('Complaint updated successfully!');
    } catch (error) {
      console.error('Error mapping complaint:', error.response || error.message);
      setMessage('Error updating complaint');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to login page
  };
  const handleCloseSnackbar = () => {
    setMessage("");
  };


  return (
    <div className="admin-dashboard">
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="User Management" value="userManagement" />
          <Tab label="Complaint Management" value="complaintManagement" />
          <Tab label="Status Management" value="statusManagement" />
          <Tab label="Employee Management" value="employeeManagement" />
          <Tab label="Dashboard Analytics" value="dashboardAnalytics" />
        </Tabs>
      </AppBar>
      <Box p={3}>
        {message && (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={Boolean(message)}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={message}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        )}
        {activeTab === "userManagement" && (
          <Box>
            <Typography variant="h4">User Data</Typography>
            <Button variant="contained" color="primary" onClick={fetchUsers} style={{ margin: '20px 0' }}>
              Fetch Users
            </Button>
            <Grid container spacing={2}>
              {users.length > 0 ? (
                users.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography color="textSecondary">{user.email}</Typography>
                        <Typography variant="body2">Username: {user.username}</Typography>
                        <Typography variant="body2">Mobile: {user.mobileNumber}</Typography>
                        <Typography variant="body2">Role: {user.role}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No users found. Click "Fetch Users" to load data.</Typography>
              )}
            </Grid>
          </Box>
        )}
        {activeTab === "complaintManagement" && (
          <Box>
            <Typography variant="h4">Complaint Management</Typography>
            <form onSubmit={handleUpdateComplaint}>
              <TextField
                label="Complaint ID"
                name="id"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Complaint Name"
                name="complaintName"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Complaint Content"
                name="complaintContent"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Comments"
                name="comments"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Status"
                name="status"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Assigned To"
                name="assignedTo"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Update Complaint
              </Button>
            </form>
            <Box mt={3}>
              <Button variant="contained" color="default" onClick={fetchComplaints} style={{ marginRight: '10px' }}>
                All Complaints
              </Button>
              <Button variant="contained" color="default" onClick={fetchOpenComplaints} style={{ marginRight: '10px' }}>
                Open Complaints
              </Button>
              <Button variant="contained" color="default" onClick={fetchClosedComplaints}>
                Closed Complaints
              </Button>
            </Box>
            <Box mt={3}>
      {complaints.length > 0 ? (
        <Grid container spacing={3}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <ComplaintCard
                complaint={complaint}
                // handleAssignComplaint={handleAssignComplaint}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No complaints found. Click "Complaint Buttons" to load data.</Typography>
      )}
    </Box>
          </Box>
        )}
        {activeTab === "statusManagement" && (
          <div>
            <h2>Status Management</h2>
            <form>
              <input type="text" name="id" placeholder="Complaint ID" onChange={handleInputChange} />
            </form>
            <button onClick={fetchComplaint}>FetchStatuses</button>
            <button onClick={mapfield}>AssignTo</button>
            <button onClick={handleDeleteComplaint}>DeleteComplaint</button>
            {fetchedComplaint ? (
              <p>{fetchedComplaint.complaintName} - {fetchedComplaint.status}</p>
            ) : (
              <p>No complaint found. Click "fetch Complaint" to load data.</p>
            )}
            {showAssignField && (
              <div>
                <input type="text" name="employeeName" placeholder="Employee Name" onChange={handleEmployeeNameChange} />
                <button onClick={handleMapComplaint}>Update</button>
              </div>
            )}
          </div>
    
        )}
        {activeTab === "employeeManagement" && (
          <div>
            <h2>Employee Management</h2>
            <form onSubmit={handleAddEmployee}>
              <input type="text" name="companyEmail" placeholder="Company Email" onChange={handleInputChange} required />
              <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleInputChange} required />
              <input type="text" name="employeeName" placeholder="Employee Name" onChange={handleInputChange} required />
              <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
              <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleInputChange} />
              <button type="submit">Add Employee</button>
            </form>
            <button onClick={() => handleUpdateEmployee()}>Update</button>
            <button onClick={() => handleDeleteEmployee()}>Delete</button>
            <div className="buttons">
              <button onClick={fetchEmployees}>All Employees</button>
            </div>
            {employees.length > 0 ? (
              <ul>
                {employees.map((employee) => (
                  <li key={employee._id}>{employee.employeeEmail} - {employee.employeeName}</li>
                ))}
              </ul>
            ) : (
              <p>No employee found. Click "All Employees" to load data.</p>
            )}
          </div>
        )}
        {activeTab === "dashboardAnalytics" && (
          <Box>
            <Typography variant="h4">Dashboard Analytics</Typography>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
            <ComplaintStatusOverview />
            <Typography variant="h5">Complaints Over Time Analysis</Typography>
            <ComplaintsOverTime />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AdminDashboard;
