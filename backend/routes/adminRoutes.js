const express = require('express');
const router = express.Router();
//const { registerUser,loginUser, userDetails } = require('../controllers/user.controller');
//const verify = require('../JWT_Auth/verify');

// User routes
router.get('/', getAllComplaints);
router.post('/addEmployee',fun);
router.put('/updateEmployee/:id', fun);
router.delete('/deleteEmployee', fun);
router.post('/mapComplaint/:issueId', fun);
router.put('/updateComplaint/:id', fun);
router.get('/openStatus', fun);
router.get('/closedStatus',fun);

module.exports = router;
