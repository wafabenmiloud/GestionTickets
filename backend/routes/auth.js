const express = require('express');
const router = express.Router();
const { signupUser, signinUser, logout, authenticateToken } = require('../controllers/authController');
const { getUsers } = require('../controllers/userController');

//user API
router.post('/register', signupUser);
router.post('/login', signinUser);
router.get('/logout',logout);
router.get('/loggedIn',authenticateToken);

router.get('/users',getUsers);

module.exports = router;
