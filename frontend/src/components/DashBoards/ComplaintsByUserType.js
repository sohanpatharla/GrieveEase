// ComplaintsByUserType.js

import React, { useEffect, useState } from 'react';
import { getComplaintsByUserType } from './api';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

const ComplaintsByUserType = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getComplaintsByUserType();
        setData(result);
      } catch (error) {
        console.error('Error fetching complaints by user type:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data ? data.map(item => item._id) : [],
    datasets: [
      {
        label: 'Number of Complaints',
        data: data ? data.map(item => item.count) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h5">Complaints by User Type</Typography>
      {data && <Bar data={chartData} options={options} />}
    </Box>
  );
};

export default ComplaintsByUserType;
