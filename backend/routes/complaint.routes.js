const router = require('express').Router()
const { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint} = require('../controllers/complaint.controller');
const verify = require('../middleware/verify');

// Complaint routes
router.post('/addComplaint', verify, addComplaint);
router.get('/complaints', verify, listComplaintsByUser);
router.put('/status', verify, updateComplaint);
router.delete('/delete', verify, deleteComplaint);

module.exports = router;
