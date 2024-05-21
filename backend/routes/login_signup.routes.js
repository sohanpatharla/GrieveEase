const express = require('express');
const router = express.Router();
const { registerUser,loginUser, userDetails } = require('../controllers/user.controller');
const verify = require('../middleware/verify');
const dbChoose = require('../middleware/dbChoose');

// User routes
router.post('/signup',dbChoose, registerUser);
router.post('/login',dbChoose, loginUser);
router.get('/profile', verify, dbChoose, userDetails);

module.exports = router;
