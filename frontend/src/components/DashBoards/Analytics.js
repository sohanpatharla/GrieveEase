import React from 'react';
import ComplaintStatusOverview from './ComplaintStatusOverview';
import ComplaintsOverTime from './ComplaintsOverTime';

const Analytics = ({ statusData, timeData, categoryData, priorityData }) => {
  return (
    <div>
      <h2>Analytics</h2>
      <ComplaintStatusOverview data={statusData} />
      <ComplaintsOverTime data={timeData} />
      {/* Add more analytics components as needed */}
    </div>
  );
};

export default Analytics;
