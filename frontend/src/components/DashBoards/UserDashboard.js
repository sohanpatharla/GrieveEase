import React, { useState, useEffect } from 'react';
import api from '../../api'; // Import the axios instance
import './UserDashboard.css'; // Custom styles if needed
import { useNavigate } from 'react-router-dom'; 

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
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Assuming user info is stored here

  useEffect(() => {
    fetchComplaints();
  }, []);

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
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/loginpage'); // Redirect to login page
  };

  return (
    <div className="container border-bottom scrollarea">
      <h1 className="my-4">User Dashboard</h1>
      <button className="btn btn-danger logout-button" onClick={handleLogout}>Logout</button>


      <div className="card mb-4">
        <div className="card-header">
          <h2>Add Complaint</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="complaintId" className="form-label">Complaint ID</label>
            <input
              type="text"
              className="form-control"
              id="complaintId"
              name="complaintId"
              value={newComplaint.complaintId}
              onChange={handleComplaintChange}
              placeholder="Complaint ID"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="complaintName" className="form-label">Complaint Name</label>
            <input
              type="text"
              className="form-control"
              id="complaintName"
              name="complaintName"
              value={newComplaint.complaintName}
              onChange={handleComplaintChange}
              placeholder="Complaint Name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="complaintContent" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="complaintContent"
              name="complaintContent"
              value={newComplaint.complaintContent}
              onChange={handleComplaintChange}
              placeholder="Description"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <input
              type="text"
              className="form-control"
              id="priority"
              name="priority"
              value={newComplaint.priority}
              onChange={handleComplaintChange}
              placeholder="Priority"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={newComplaint.category}
              onChange={handleComplaintChange}
              placeholder="Category"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comments" className="form-label">Comments</label>
            <input
              type="text"
              className="form-control"
              id="comments"
              name="comments"
              value={newComplaint.comments}
              onChange={handleComplaintChange}
              placeholder="Comments"
            />
          </div>
          <button className="btn btn-primary" onClick={addComplaint}>Add Complaint</button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h2>Your Complaints</h2>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="list-group-item">
                <div className="complaint-info">
                  <div><strong>ID:</strong> {complaint.complaintId}</div>
                  <div><strong>Name:</strong> {complaint.complaintName}</div>
                  <div><strong>Description:</strong> {complaint.complaintContent}</div>
                  <div><strong>Priority:</strong> {complaint.priority}</div>
                  <div><strong>Category:</strong> {complaint.category}</div>
                  <div><strong>Comments:</strong> {complaint.comments}</div>
                  <div><strong>Status:</strong> {complaint.status}</div>
                  <div><strong>Last Updated:</strong> {new Date(complaint.lastUpdated).toLocaleString()}</div>
                </div>
                <button className="btn btn-secondary mt-2" onClick={() => setEditComplaint(complaint)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {editComplaint && (
        <div className="card">
          <div className="card-header">
            <h2>Edit Complaint</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="editComplaintName" className="form-label">Complaint Name</label>
              <input
                type="text"
                className="form-control"
                id="editComplaintName"
                name="complaintName"
                value={editComplaint.complaintName}
                onChange={handleEditComplaintChange}
                placeholder="Complaint Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editComplaintContent" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="editComplaintContent"
                name="complaintContent"
                value={editComplaint.complaintContent}
                onChange={handleEditComplaintChange}
                placeholder="Description"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="editPriority" className="form-label">Priority</label>
              <input
                type="text"
                className="form-control"
                id="editPriority"
                name="priority"
                value={editComplaint.priority}
                onChange={handleEditComplaintChange}
                placeholder="Priority"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editCategory" className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                id="editCategory"
                name="category"
                value={editComplaint.category}
                onChange={handleEditComplaintChange}
                placeholder="Category"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editComments" className="form-label">Comments</label>
              <input
                type="text"
                className="form-control"
                id="editComments"
                name="comments"
                value={editComplaint.comments}
                onChange={handleEditComplaintChange}
                placeholder="Comments"
              />
            </div>
            <button className="btn btn-primary" onClick={() => updateComplaint(editComplaint._id)}>Update Complaint</button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default UserDashboard;