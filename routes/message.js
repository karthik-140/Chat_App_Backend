const express = require('express');

const userAthentication = require('../middleware/auth');
const messageControllers = require('../controllers/messageControllers');

const router = express();

router.post('/sendMessage', userAthentication.authenticate, messageControllers.sendMessage);

module.exports = router;
