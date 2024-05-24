const express = require('express');
const router = express.Router();
const verify = require('../JWT_Auth/verify');
const {
    getAllComplaints,
    getComplaint,
    getAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    mapComplaint,
    updateComplaint,
    openStatus,
    closedStatus
} = require('../controllers/adminController');

// Use verify middleware to protect routes if needed
router.get('/complaints', getAllComplaints);
router.get('/complaint/:id',getComplaint);
router.get('/employees', getAllEmployees);
router.post('/addEmployee',verify, addEmployee);
router.put('/updateEmployee/:id',verify, updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);
router.post('/mapComplaint/:id', mapComplaint);
router.put('/updateComplaint/:id', updateComplaint);
router.get('/openStatus', openStatus);
router.get('/closedStatus', closedStatus);

module.exports = router;
