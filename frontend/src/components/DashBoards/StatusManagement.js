import React from 'react';

const StatusManagement = ({ statusData }) => {
  return (
    <div>
      <h2>Status Management</h2>
      <ul>
        {statusData.map(status => (
          <li key={status.name}>{status.name}: {status.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default StatusManagement;
