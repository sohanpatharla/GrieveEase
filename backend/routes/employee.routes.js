const express = require('express');
const router = express.Router();
//const { registerUser,loginUser, userDetails } = require('../controllers/user.controller');
//const verify = require('../JWT_Auth/verify');

// Employee routes

router.post('/login', loginEmployee);
router.get('/profile', verify,employeeDetails)