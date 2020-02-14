const express = require('express');
const router = express.Router();

const users = require('../controllers/users/users.controllers')


// user signup route
router.post('/signup', users.signUp)

// user login route
router.post('/login', users.login)

// user email verify route
router.post('/emailverify', users.emailVerification)

// user forgot password route
router.post('/forgotpassword', users.forgotPassword)

// user reset password route
router.post('/resetpassword', users.resetPassword)

module.exports = router;
