const router = require('express').Router()
const { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint} = require('../controllers/complaint.controller');
const verify = require('../JWT_Auth/verify');

// Complaint routes
router.post('/addComplaint', verify, addComplaint);
router.get('/complaints', verify, listComplaintsByUser);
router.put('/status/:id', verify, updateComplaint);
router.put('/delete/:id', verify, deleteComplaint);

module.exports = router;
