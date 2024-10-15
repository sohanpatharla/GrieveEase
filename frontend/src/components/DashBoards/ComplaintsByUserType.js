// ComplaintsByUserType.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../api';

const ComplaintsByUserType = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get(`${process.env.REACT_APP_BACKEND_URL}/complaints/complaintsbyuser`);
        console.log(result);
        setData(result.data);
      } catch (error) {
        console.error('Error fetching complaints by user type:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Complaints by User Type</Typography>

      {/* Iterate over users */}
      {data && data.length > 0 ? (
        data.map(user => (
          <Accordion key={user._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{user._id} - {user.count} Complaints</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Fetch and display complaints for each user */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Complaint ID</TableCell>
                      <TableCell>Complaint Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date Created</TableCell>
                      <TableCell>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.complaints.map(complaint => (
                      <TableRow key={complaint.complaintId}>
                        <TableCell>{complaint.complaintId}</TableCell>
                        <TableCell>{complaint.complaintName}</TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell>{complaint.priority}</TableCell>
                        <TableCell>{complaint.status}</TableCell>
                        <TableCell>{new Date(complaint.createdOn).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(complaint.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>No data available.</Typography>
      )}
    </Box>
  );
};

export default ComplaintsByUserType;
