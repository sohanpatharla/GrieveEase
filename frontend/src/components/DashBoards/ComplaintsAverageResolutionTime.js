// ComplaintsAverageResolutionTime.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@material-ui/core';
import api from '../../api';

const ComplaintsAverageResolutionTime = () => {
  const [averageResolutionTime, setAverageResolutionTime] = useState([]);

  useEffect(() => {
    fetchAverageResolutionTime();
  }, []);

  const fetchAverageResolutionTime = async () => {
    try {
        const response = await api.get(
            `${process.env.REACT_APP_BACKEND_URL}/complaints/avgrestime`
          );
      setAverageResolutionTime(response.data);
    } catch (error) {
      console.error('Error fetching average resolution time:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Average Resolution Time by Category</Typography>
      <ul>
        {averageResolutionTime.map((item, index) => (
          <li key={index}>
            {item._id}: {item.avgResolutionTime.toFixed(2)} days
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ComplaintsAverageResolutionTime;
