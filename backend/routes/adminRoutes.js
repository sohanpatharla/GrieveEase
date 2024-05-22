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
router.get('/', verify, getAllComplaints);
router.post('/addEmployee', verify, addEmployee);
router.put('/updateEmployee/:id', verify, updateEmployee);
router.delete('/deleteEmployee', verify, deleteEmployee);
router.post('/mapComplaint/:id', verify, mapComplaint);
router.put('/updateComplaint/:id', verify, updateComplaint);
router.get('/openStatus', verify, openStatus);
router.get('/closedStatus', verify, closedStatus);

module.exports = router;
