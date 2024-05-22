const express = require('express');
const router = express.Router();
const { loginEmployee,employeeDetails } = require('../controllers/employeeControll');
const verify = require('../JWT_Auth/verify');

// Employee routes

router.post('/login', loginEmployee);
router.get('/profile', verify,employeeDetails)