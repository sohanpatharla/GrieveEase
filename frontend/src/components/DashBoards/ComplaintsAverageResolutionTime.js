import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import api from '../../api';

const ComplaintsAverageResolutionTime = () => {
  const [averageResolutionTime, setAverageResolutionTime] = useState([]);

  useEffect(() => {
    fetchAverageResolutionTime();
  }, []);

  const fetchAverageResolutionTime = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_BACKEND_URL}/complaints/avgrestime`);
      setAverageResolutionTime(response.data);
    } catch (error) {
      console.error('Error fetching average resolution time:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Average Resolution Time by Employee</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Average Resolution Time (Days)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {averageResolutionTime.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.employeeName}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.avgResolutionTime.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ComplaintsAverageResolutionTime;
