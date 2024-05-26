import React, { useState, useEffect } from 'react';
import './EmployeeDashboard.css';
import api from '../../api';

const EmployeeDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [showDetails, setShowDetails] = useState(false);

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
    if (selectedComplaint && selectedComplaint.complaintId === complaint.complaintId) {
      setShowDetails(!showDetails);
    } else {
      setSelectedComplaint(complaint);
      setResponse(complaint.comments || '');
      setStatus(complaint.status || '');
      setShowDetails(true);
    }
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

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      <div className="complaint-list">
        <h2>Assigned Complaints</h2>
        <ul>
          {complaints.map(complaint => (
            <li key={complaint.complaintId}>
              <button onClick={() => handleComplaintSelect(complaint)}>
                {complaint.complaintName} - {complaint.status}
              </button>
              {selectedComplaint && selectedComplaint.complaintId === complaint.complaintId && showDetails && (
                <div className="complaint-details">
                  <h2>Complaint Details</h2>
                  <p><strong>ID:</strong> {complaint.complaintId}</p>
                  <p><strong>Name:</strong> {complaint.complaintName}</p>
                  <p><strong>Description:</strong> {complaint.complaintContent}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Assigned To:</strong> {complaint.assignedTo}</p>
                  <p><strong>Status:</strong> {complaint.status}</p>
                  <p><strong>Created On:</strong> {new Date(complaint.createdOn).toLocaleString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(complaint.lastUpdated).toLocaleString()}</p>
                  <p><strong>Attachments:</strong></p>
                  <ul>
                    {complaint.attachments.map((file, index) => (
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
                      <option value="Closed">Closed</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <button onClick={handleUpdateComplaint}>Update Complaint</button>
                  </div>
                  <div className="chat-section">
                    <h3>Chat Section</h3>
                    {/* Chat implementation will go here */}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
