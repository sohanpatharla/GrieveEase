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

  // useEffect(() => {
  //   fetchData();
  // }, []);

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
    try {
      const res = await axios.get('http://localhost:5000/api/users/profiles');
      console.log('Fetched users:', res.data);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/complaints');
      console.log('Fetched Complaints:', res.data);
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/statuses');
      setStatuses(res.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/addEmployee', formData);
      setMessage('Employee added successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error adding employee');
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/updateEmployee/${id}`, formData);
      setMessage('Employee updated successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error updating employee');
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete('http://localhost:5000/api/admin/deleteEmployee', { data: { id } });
      setMessage('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      setMessage('Error deleting employee');
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateComplaint = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/updateComplaint/${id}`, formData);
      setMessage('Complaint updated successfully!');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error.response || error.message);
      setMessage('Error updating complaint');
      console.error('Error updating complaint:', error);
    }
  };

  const handleMapComplaint = async (e) => {
    e.preventDefault();
    const { id } = formData;
    try {
      const res = await axios.post(`http://localhost:5000/api/admin/mapComplaint/${id}`, formData);
      setMessage('Complaint mapped successfully!');
      fetchComplaints();
    } catch (error) {
      setMessage('Error mapping complaint');
      console.error('Error mapping complaint:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button className={activeTab === 'userManagement' ? 'active' : ''} onClick={() => handleTabChange('userManagement')}>User Management</button>
        <button className={activeTab === 'complaintManagement' ? 'active' : ''} onClick={() => handleTabChange('complaintManagement')}>Complaint Management</button>
        <button className={activeTab === 'statusManagement' ? 'active' : ''} onClick={() => handleTabChange('statusManagement')}>Status Management</button>
        <button className={activeTab === 'employeeManagement' ? 'active' : ''} onClick={() => handleTabChange('employeeManagement')}>Employee Management</button>
        <button className={activeTab === 'dashboardAnalytics' ? 'active' : ''} onClick={() => handleTabChange('dashboardAnalytics')}>Dashboard Analytics</button>
      </div>
      <div className="dashboard-content">
        {message && <p className="message">{message}</p>}
        {activeTab === 'userManagement' && (
          <div>
            <h2>User Data</h2>
            <div className="buttons">
              <button onClick={fetchUsers}>Fetch Users</button>
            </div>
            {users.length > 0 ? (
              <ul>
                {users.map(user => (
                  <li key={user._id}>{user.name} - {user.email}</li>
                ))}
              </ul>
            ) : (
              <p>No users found. Click "Fetch Users" to load data.</p>
            )}
          </div>
        )}
        {activeTab === 'complaintManagement' && (
          <div>
            <h2>Complaint Management</h2>
            <form onSubmit={handleUpdateComplaint}>
              <input type="text" name="id" placeholder="Complaint ID" onChange={handleInputChange} />
              <input type="text" name="complaintName" placeholder="Complaint Name" onChange={handleInputChange} />
              <input type="text" name="complaintContent" placeholder="Complaint Content" onChange={handleInputChange} />
              <input type="text" name="status" placeholder="Status" onChange={handleInputChange} />
              <button type="submit">Update Complaint</button>
            </form>
            <div className="buttons">
              <button onClick={fetchComplaints}>Complaints</button>
            </div>
            {users.length > 0 ? (
            <ul>
              {complaints.map(complaint => (
                <li key={complaint._id}>{complaint.complaintName} - {complaint.status}</li>
              ))}
            </ul>
            ) : (
              <p>No users found. Click "Fetch Users" to load data.</p>
            )}
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
            <form onSubmit={handleAddEmployee}>
              <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
              <button type="submit">Add Employee</button>
            </form>
            <ul>
              {employees.map(employee => (
                <li key={employee.id}>
                  {employee.name} - {employee.email}
                  <button onClick={() => handleUpdateEmployee(employee.id)}>Update</button>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'dashboardAnalytics' && (
          <div>
            <h2>Dashboard Analytics</h2>
            <pre>{JSON.stringify(analytics, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
