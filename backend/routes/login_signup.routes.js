const express = require('express');
const router = express.Router();
const { registerUser,loginUser, userDetails ,logoutUser} = require('../controllers/user.controller');
const verify = require('../JWT_Auth/verify');

// User routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', userDetails);
router.get('/logout',logoutUser);


module.exports = router;
