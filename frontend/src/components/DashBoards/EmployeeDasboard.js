import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css';
import api from '../../api';
import { useNavigate } from 'react-router-dom'; 


const EmployeeDashboard = () => {
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
    navigate('/loginpage'); // Redirect to login page
  };

  return (
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
            <button onClick={handleUpdateComplaint}>Update Complaint</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
