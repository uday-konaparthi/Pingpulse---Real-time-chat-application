const express = require('express');
const {handleRegister, handleLogin, handleLogout, handleAutoLogin} = require("../controller/authController.js");

const router = express.Router();

// authentication routes
router.post('/register', handleRegister)
router.post('/login', handleLogin)
router.post('/autologin', handleAutoLogin)
router.post('/logout', handleLogout)

module.exports = router;
