const chatSocketController = require('../controllers/chatSocketController');

function initSocketManager(io) {
    io.on('connection', function onConnection(socket) {
        chatSocketController.registerChatSocketHandlers(io, socket);
    });
}

module.exports = initSocketManager;
