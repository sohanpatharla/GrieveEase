const express = require('express');
const router = express.Router();
const { registerUser,loginUser, userDetails } = require('../controllers/userController');
const verify = require('../JWT_Auth/verify');

// User routes
// router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/register',registerUser);
router.get('/profiles', userDetails);

module.exports = router;
