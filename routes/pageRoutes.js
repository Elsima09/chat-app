const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageController.renderLoginPage);
router.get('/register', pageController.renderRegisterPage);
router.get('/chat', pageController.renderChatPage);

module.exports = router;
