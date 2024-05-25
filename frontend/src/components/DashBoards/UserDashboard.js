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
  const [editComplaint, setEditComplaint] = useState({
    complaintName: '',
    complaintContent: '',
    priority: '',
    category: '',
    comments: '',
  });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [cId, setCId] = useState('');
  const [fetchComplaintId, setFetchComplaintId] = useState(''); // State for fetch complaint ID
  const [fetchedComplaint, setFetchedComplaint] = useState(null); // State to store fetched complaint

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDeleteComplaint = (e) => {
    const { value } = e.target;
    setCId(value);
  };

  const deleteComplaint = async (id) => {
    try {
      await api.delete(`/complaints/delete/${id}`);
      setComplaints(complaints.filter(complaint => complaint._id !== id));
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setError('Error deleting complaint');
    }
  };

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
    console.log(editComplaint)
    try {
      await api.patch(`/complaints/updateComplaint/${id}`, { ...editComplaint});
      // fetchComplaints();
      //setEditComplaint(null);
      //setError('');
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

  const handleFetchComplaintChange = (e) => {
    setFetchComplaintId(e.target.value);
  };

  const fetchComplaintById = async (id) => {
    try {
      const res = await api.get(`/complaints/complaint/${id}`);
      setFetchedComplaint(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching complaint:', err);
      setError('Error fetching complaint');
    }
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
              <button className="editButton" onClick={() => setEditComplaint(complaint)}>Edit</button>
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
          <button onClick={() => updateComplaint(editComplaint.com)}>Update Complaint</button>
        </div>
      )}

      <div className="list-complaint">
        <input type="text" name="compId" value={cId} placeholder="Enter Complaint-Id" onChange={handleDeleteComplaint} />
        <button onClick={() => deleteComplaint(cId)}>Delete Complaint</button>
      </div>

      <div className="fetch-complaint">
        <input type="text" name="fetchCompId" value={fetchComplaintId} placeholder="Enter Complaint-Id" onChange={handleFetchComplaintChange} />
        <button onClick={() => fetchComplaintById(fetchComplaintId)}>Fetch Complaint</button>
        {fetchedComplaint && (
          <div>
            <h2>Fetched Complaint</h2>
            <div className="complaint-info">
              <span>ID: {fetchedComplaint.complaintId}</span>
              <span>Name: {fetchedComplaint.complaintName}</span>
              <span>Description: {fetchedComplaint.complaintContent}</span>
              <span>Priority: {fetchedComplaint.priority}</span>
              <span>Category: {fetchedComplaint.category}</span>
              <span>Comments: {fetchedComplaint.comments}</span>
              <span>Status: {fetchedComplaint.status}</span>
              <span>Last Updated: {new Date(fetchedComplaint.lastUpdated).toLocaleString()}</span>
            </div>
            <button className="editButton" onClick={() => setEditComplaint(fetchedComplaint)}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
