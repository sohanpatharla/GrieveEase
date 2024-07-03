import React from 'react';

const ComplaintManagement = ({ complaints, handleAssignComplaint, handleDeleteComplaint }) => {
  return (
    <div>
      <h2>Complaint Management</h2>
      <ul>
        {complaints.map(complaint => (
          <li key={complaint.id}>
            {complaint.description}
            <button onClick={() => handleAssignComplaint(complaint.id)}>Assign</button>
            <button onClick={() => handleDeleteComplaint(complaint.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintManagement;
