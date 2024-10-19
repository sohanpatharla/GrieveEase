// ComplaintsByCategory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@material-ui/core';
import api from '../../api';

const ComplaintsByCategory = () => {
  const [complaintsByCategory, setComplaintsByCategory] = useState([]);

  useEffect(() => {
    fetchComplaintsByCategory();
  }, []);

  const fetchComplaintsByCategory = async () => {
    try {
        const response = await api.get(
            `${import.meta.env.VITE_APP_BACKEND_URL}/complaints/category`
          );
      
      setComplaintsByCategory(response.data);
    } catch (error) {
      console.error('Error fetching complaints by category:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Complaints by Category</Typography>
      <ul>
        {complaintsByCategory.map((category, index) => (
          <li key={index}>
            {category._id}: {category.count}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ComplaintsByCategory;
