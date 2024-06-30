const express = require('express');
const router = express.Router();
const verify = require('../JWT_Auth/verify');
const {
    loginAdmin,
    getAllComplaints,
    getComplaint,
    deleteComplaint,
    getAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    mapComplaint,
    updateComplaint,
    openStatus,
    closedStatus,
    getComplaintStatuses
} = require('../controllers/adminController');

// Use verify middleware to protect routes if needed
router.post('/login', loginAdmin);
router.get('/complaints', getAllComplaints);
router.get('/complaint/:id',getComplaint);
router.delete('/delete/:id', deleteComplaint);
router.get('/employees', getAllEmployees);
router.post('/addEmployee',verify, addEmployee);
router.put('/updateEmployee/:id',verify, updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);
router.post('/mapComplaint/:id', mapComplaint);
router.put('/updateComplaint/:id', updateComplaint);
router.get('/openStatus', openStatus);
router.get('/closedStatus', closedStatus);
router.get('/complaintStatuses', getComplaintStatuses); 

module.exports = router;
