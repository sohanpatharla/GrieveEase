import React, { useState, useEffect } from 'react';
import api from '../../api'; // Import the axios instance
import './UserDashboard.css';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    complaintId: '',
    complaintName: '',
    complaintContent: '',
    priority: 'Medium',
    category: 'Technical',
    attachments: [],
    comments: '',
    createdOn: new Date(),
    status: 'Pending',
    lastUpdated: new Date(),
    assignedTo: '',
  });
  const [editComplaint, setEditComplaint] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); // Assuming user info is stored here

  // useEffect(() => {
  //   fetchComplaints();
  // }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Error fetching complaints');
    }
  };

  const addComplaint = async () => {
    try {
      const res = await api.post('/complaints/addComplaint', { ...newComplaint, createdBy: user });
      console.log(res.data);
      setComplaints([...complaints, res.data]);
      setNewComplaint({
        complaintId: '',
        complaintName: '',
        complaintContent: '',
        priority: 'Medium',
        category: 'Technical',
        attachments: [],
        comments: '',
        createdOn: new Date(),
        status: 'Pending',
        lastUpdated: new Date(),
        assignedTo: '',
      });
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

  return (
    <div className="dashboard-container">
      <h1>User Dashboard</h1>

      <div className="add-complaint">
        <h2>Add Complaint</h2>
        <input
          type="text"
          name="complaintId"
          value={newComplaint.complaintId}
          onChange={handleComplaintChange}
          placeholder="Complaint ID"
        />
        <input
          type="text"
          name="complaintName"
          value={newComplaint.complaintName}
          onChange={handleComplaintChange}
          placeholder="Complaint Name"
        />
        <textarea
          name="complaintContent"
          value={newComplaint.complaintContent}
          onChange={handleComplaintChange}
          placeholder="Description"
        ></textarea>
        <input
          type="text"
          name="priority"
          value={newComplaint.priority}
          onChange={handleComplaintChange}
          placeholder="Priority"
        />
        <input
          type="text"
          name="category"
          value={newComplaint.category}
          onChange={handleComplaintChange}
          placeholder="Category"
        />
        <input
          type="text"
          name="comments"
          value={newComplaint.comments}
          onChange={handleComplaintChange}
          placeholder="Comments"
        />
        <button onClick={addComplaint}>Add Complaint</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="list-complaints">
        <h2>Your Complaints</h2>
        <ul>
          {complaints.map((complaint) => (
            <li key={complaint._id}> {/* Ensure _id is unique */}
              <div className="complaint-info">
                <span>ID: {complaint.complaintId}</span>
                <span>Name: {complaint.complaintName}</span>
                <span>Description: {complaint.complaintContent}</span>
                <span>Priority: {complaint.priority}</span>
                <span>Category: {complaint.category}</span>
                <span>Comments: {complaint.comments}</span>
                <span>Status: {complaint.status}</span>
                <span>Last Updated: {new Date(complaint.lastUpdated).toLocaleString()}</span>
              </div>
              <button onClick={() => setEditComplaint(complaint)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>

      {editComplaint && (
        <div className="edit-complaint">
          <h2>Edit Complaint</h2>
          <input
            type="text"
            name="complaintName"
            value={editComplaint.complaintName}
            onChange={handleEditComplaintChange}
            placeholder="Complaint Name"
          />
          <textarea
            name="complaintContent"
            value={editComplaint.complaintContent}
            onChange={handleEditComplaintChange}
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            name="priority"
            value={editComplaint.priority}
            onChange={handleEditComplaintChange}
            placeholder="Priority"
          />
          <input
            type="text"
            name="category"
            value={editComplaint.category}
            onChange={handleEditComplaintChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="comments"
            value={editComplaint.comments}
            onChange={handleEditComplaintChange}
            placeholder="Comments"
          />
          <button onClick={() => updateComplaint(editComplaint.complaintId)}>Update Complaint</button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
