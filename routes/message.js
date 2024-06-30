const express = require('express');
const multer = require('multer');

const userAthentication = require('../middleware/auth');
const messageControllers = require('../controllers/messageControllers');

const storage = multer.memoryStorage();
const upload = multer({ storage })

const router = express();

router.post('/sendMessage', userAthentication.authenticate, messageControllers.sendMessage);

router.post('/uploadFile', userAthentication.authenticate, upload.single('file'), messageControllers.uploadFile);

router.get('/getMessages', userAthentication.authenticate, messageControllers.getMessages);

module.exports = router;
