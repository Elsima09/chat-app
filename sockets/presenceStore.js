const onlineUsers = {};
const activeChats = {};

function setUserOnline(username, socketId) {
    onlineUsers[username] = socketId;
}

function removeUserBySocketId(socketId) {
    for (const username in onlineUsers) {
        if (onlineUsers[username] === socketId) {
            delete onlineUsers[username];
            return username;
        }
    }
    return null;
}

function getSocketIdForUser(username) {
    return onlineUsers[username];
}

function getOnlineUsernames() {
    return Object.keys(onlineUsers);
}

function setActiveChat(username, chattingWith) {
    activeChats[username] = chattingWith;
}

function isChatActiveBetween(viewerUsername, otherUsername) {
    return activeChats[viewerUsername] === otherUsername;
}

module.exports = {
    setUserOnline,
    removeUserBySocketId,
    getSocketIdForUser,
    getOnlineUsernames,
    setActiveChat,
    isChatActiveBetween
};
