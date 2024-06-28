const express = require('express');

const userControllers = require('../controllers/userControllers');
const userAthentication = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userControllers.signupUser);

router.post('/login', userControllers.loginUser);

router.get('/getAllGroupUsers', userAthentication.authenticate, userControllers.getAllGroupUsers);

module.exports = router;
