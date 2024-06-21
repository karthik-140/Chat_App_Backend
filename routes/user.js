const express = require('express');

const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', userControllers.signupUser);

router.post('/login', userControllers.loginUser);

module.exports = router;
