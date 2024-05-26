const express = require('express');
const router = express.Router();
const { loginEmployee,employeeDetails ,assignedComplaints,updateComplaint} = require('../controllers/employeeController');
const verify = require('../JWT_Auth/verify');

// Employee routes

router.post('/login', loginEmployee);
router.get('/profile', verify,employeeDetails);
router.get('/assignedComplaints',verify,assignedComplaints); 
router.put('/updateComplaint/:complaintId', verify, updateComplaint);  

module.exports = router;