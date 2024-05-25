const router = require('express').Router();
const { addComplaint, updateComplaint, listComplaintsByUser, listComplaintById, deleteComplaint } = require('../controllers/complaintController');
const verify = require('../JWT_Auth/verify');

// Complaint routes
router.post('/addComplaint', verify, addComplaint);
router.get('/complaints', verify, listComplaintsByUser);
router.get('/complaint/:id', verify, listComplaintById);
router.put('/updateComplaint/:id', verify, updateComplaint);
router.delete('/delete/:id', verify, deleteComplaint);

module.exports = router;
