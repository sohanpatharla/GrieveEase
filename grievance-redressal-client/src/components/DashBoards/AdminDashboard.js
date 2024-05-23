import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('userManagement');
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchUsers();
    await fetchComplaints();
    await fetchStatuses();
    await fetchEmployees();
    await fetchAnalytics();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
  };

  const fetchUsers = async () => {
    // Implement fetch users if required
  };

  const fetchComplaints = async () => {
    const res = await axios.get('/api/admin');
    setComplaints(res.data);
  };

  const fetchStatuses = async () => {
    const res = await axios.get('/api/admin/openStatus');
    setStatuses(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get('/api/employees');
    setEmployees(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await axios.get('/api/analytics');
    setAnalytics(res.data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/addEmployee', formData);
      setMessage('Employee added successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error adding employee');
    }
  };

  const handleUpdateEmployee = async (id) => {
    try {
      const res = await axios.put(`/api/admin/updateEmployee/${id}`, formData);
      setMessage('Employee updated successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error updating employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete('/api/admin/deleteEmployee', { data: { id } });
      setMessage('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error deleting employee');
    }
  };

  const handleUpdateComplaint = async (id) => {
    try {
      const res = await axios.put(`/api/admin/updateComplaint/${id}`, formData);
      setMessage('Complaint updated successfully!');
      fetchComplaints();
    } catch (error) {
      setMessage('Error updating complaint');
    }
  };

  const handleMapComplaint = async (id) => {
    try {
      const res = await axios.post(`/api/admin/mapComplaint/${id}`, formData);
      setMessage('Complaint mapped successfully!');
      fetchComplaints();
    } catch (error) {
      setMessage('Error mapping complaint');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button
          className={activeTab === 'userManagement' ? 'active' : ''}
          onClick={() => handleTabChange('userManagement')}
        >
          User Management
        </button>
        <button
          className={activeTab === 'complaintManagement' ? 'active' : ''}
          onClick={() => handleTabChange('complaintManagement')}
        >
          Complaint Management
        </button>
        <button
          className={activeTab === 'statusManagement' ? 'active' : ''}
          onClick={() => handleTabChange('statusManagement')}
        >
          Status Management
        </button>
        <button
          className={activeTab === 'employeeManagement' ? 'active' : ''}
          onClick={() => handleTabChange('employeeManagement')}
        >
          Employee Management
        </button>
        <button
          className={activeTab === 'dashboardAnalytics' ? 'active' : ''}
          onClick={() => handleTabChange('dashboardAnalytics')}
        >
          Dashboard Analytics
        </button>
      </div>
      <div className="dashboard-content">
        {message && <p className="message">{message}</p>}
        {activeTab === 'userManagement' && (
          <div>
            <h2>User Management</h2>
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.name} - {user.email}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'complaintManagement' && (
          <div>
            <h2>Complaint Management</h2>
            <ul>
              {complaints.map(complaint => (
                <li key={complaint.id}>{complaint.complaintName} - {complaint.status}</li>
              ))}
            </ul>
            <form onSubmit={(e) => handleUpdateComplaint(formData.id)}>
              <input type="text" name="complaintName" placeholder="Complaint Name" onChange={handleInputChange} />
              <input type="text" name="complaintContent" placeholder="Complaint Content" onChange={handleInputChange} />
              <input type="text" name="status" placeholder="Status" onChange={handleInputChange} />
              <button type="submit">Update Complaint</button>
            </form>
          </div>
        )}
        {activeTab === 'statusManagement' && (
          <div>
            <h2>Status Management</h2>
            <ul>
              {statuses.map(status => (
                <li key={status.id}>{status.name}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'employeeManagement' && (
          <div>
            <h2>Employee Management</h2>
            <ul>
              {employees.map(employee => (
                <li key={employee.id}>{employee.name} - {employee.role}</li>
              ))}
            </ul>
            <form onSubmit={handleAddEmployee}>
              <input type="text" name="companyEmail" placeholder="Company Email" onChange={handleInputChange} />
              <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleInputChange} />
              <input type="text" name="employeeName" placeholder="Employee Name" onChange={handleInputChange} />
              <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
              <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleInputChange} />
              <button type="submit">Add Employee</button>
            </form>
          </div>
        )}
        {activeTab === 'dashboardAnalytics' && (
          <div>
            <h2>Dashboard Analytics</h2>
            <p>Total Users: {analytics.totalUsers}</p>
            <p>Total Complaints: {analytics.totalComplaints}</p>
            <p>Resolved Complaints: {analytics.resolvedComplaints}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
