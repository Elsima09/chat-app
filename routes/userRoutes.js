const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.listAllUsers);
router.get('/last-seen/:username', userController.getLastSeen);
router.post('/users/avatar', userController.setAvatar);

module.exports = router;
