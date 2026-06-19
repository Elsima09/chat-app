const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/messages/:user1/:user2', messageController.getConversation);
router.get('/last-messages/:me', messageController.getLastMessages);
router.get('/unread/:me', messageController.getUnreadCounts);
router.delete('/delete-message/:id/everyone', messageController.deleteForEveryone);
router.delete('/delete-message/:id/me', messageController.deleteForMe);
router.post('/star-message/:id', messageController.starMessage);
router.delete('/star-message/:id', messageController.unstarMessage);
router.get('/starred-messages/:username', messageController.getStarredMessages);

module.exports = router;
