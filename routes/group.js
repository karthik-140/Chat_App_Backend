const express = require('express');

const userAthentication = require('../middleware/auth');
const groupControllers = require('../controllers/groupControllers');

const router = express.Router();

router.post('/createGroup', userAthentication.authenticate, groupControllers.createGroup);

router.get('/getAllGroups', userAthentication.authenticate, groupControllers.getAllGroups);

router.get('/groupDetails/:groupId', userAthentication.authenticate, groupControllers.getAllGroupDetails);

router.post('/addUsers/:groupId', userAthentication.authenticate, groupControllers.addUsersToGroup);

router.put('/makeIsAdmin', userAthentication.authenticate, groupControllers.makeUserIsAdmin);

router.delete('/removeUser', userAthentication.authenticate, groupControllers.removeUserFromGroup);

router.delete('/exitGroup', userAthentication.authenticate, groupControllers.existFromGroup);

module.exports = router
