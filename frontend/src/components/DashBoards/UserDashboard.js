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
  const [compId, setCompId] = useState('');
  const [cId, setCId] = useState('');

  useEffect(() => {
    fetchComplaints(); // Fetch complaints on component mount
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
      setError(''); // Reset error state on successful fetch
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Error fetching complaints');
    }
  };

  const fetchComplaint = async (id) => {
    try {
      const res = await api.get(`/complaints/complaint/${id}`);
      setComplaints([res.data]); // Use an array to update state
      setError(''); // Reset error state on successful fetch
    } catch (err) {
      console.error('Error fetching complaint:', err);
      setError('Error fetching complaint');
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await api.delete(`/complaints/delete/${id}`);
      
      setError(''); // Reset error state on successful deletion
      fetchComplaints(); // Refresh complaints after deletion
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setError('Error deleting complaint');
    }
  };

  const addComplaint = async () => {
    try {
      const res = await api.post('/complaints/addComplaint', { ...newComplaint });
      setComplaints([...complaints, res.data]);
      setNewComplaint({ ...newComplaint, complaintId: '', complaintName: '', complaintContent: '', comments: '' });
      setError(''); // Reset error state on successful complaint addition
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
      setError(''); // Reset error state on successful complaint update
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

  const handleComplaintId = (e) => {
    const { value } = e.target;
    setCompId(value);
  };

  const handleDeleteComplaint = (e) => {
    const { value } = e.target;
    setCId(value);
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

      <div className="fetch-complaint">
        <input type="text" name="compId" value={compId} placeholder="Enter Complaint-Id" onChange={handleComplaintId} />
        <button onClick={() => fetchComplaint(compId)}>Fetch Complaint</button>
        <button onClick={fetchComplaints}>Fetch All Complaints</button>
      </div>

      <div className="fetch-complaint">
        <input type="text" name="compId" value={cId} placeholder="Enter Complaint-Id" onChange={handleDeleteComplaint} />
        <button onClick={() => deleteComplaint(cId)}>Delete Complaint</button>
      </div>

      <div className="list-complaints">
        <h2>Your Complaints</h2>
        <ul>
          {complaints.map((complaint) => (
            <li key={complaint._id}>
              {/* Display complaint details */}
              <button onClick={() => setEditComplaint(complaint)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>

      {editComplaint && (
        <div className="edit-complaint">
          <h2>Edit Complaint</h2>
          {/* Input fields for editing complaints */}
          <button onClick={() => updateComplaint(editComplaint.complaintId)}>Update Complaint</button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
