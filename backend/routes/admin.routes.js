const express = require('express');
const router = express.Router();
//const { registerUser,loginUser, userDetails } = require('../controllers/user.controller');
//const verify = require('../JWT_Auth/verify');

// User routes
router.get('/', getAllComplints);
router.post('/addEmployee', fun);
router.put('/updateEmployee/:id',verifyadmin, fun);
router.delete('/deleteEmployee', verify, fun);
router.post('/mapComplaint/:issueId', fun);
router.put('/updateComplaint/:id', fun);
router.get('/openStatus', fun);
router.get('/closedStatus',fun);

module.exports = router;
