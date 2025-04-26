const express = require('express');
const router = express.Router();
const { signupUser, signinUser, logout, authenticateToken } = require('../controllers/authController');
const { getUsers } = require('../controllers/userController');
const authToken = require('../services/authToken');

//user API
router.post('/register', signupUser);
router.post('/login', signinUser);
router.get('/logout',logout);
router.get('/loggedIn',authenticateToken);

router.get('/users', authToken, getUsers);
module.exports = router;
