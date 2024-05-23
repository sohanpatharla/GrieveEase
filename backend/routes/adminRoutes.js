const express = require('express');
const router = express.Router();
const verify = require('../JWT_Auth/verify');
const {
    getAllComplaints,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    mapComplaint,
    updateComplaint,
    openStatus,
    closedStatus
} = require('../controllers/adminController');

// Use verify middleware to protect routes if needed
router.get('/', getAllComplaints);
router.post('/addEmployee', addEmployee);
router.put('/updateEmployee/:id', updateEmployee);
router.delete('/deleteEmployee', deleteEmployee);
router.post('/mapComplaint/:id', mapComplaint);
router.put('/updateComplaint/:id', updateComplaint);
router.get('/openStatus', openStatus);
router.get('/closedStatus', closedStatus);

module.exports = router;
