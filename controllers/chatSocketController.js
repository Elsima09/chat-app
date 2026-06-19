const userModel = require('../models/userModel');
const messageModel = require('../models/messageModel');
const reactionModel = require('../models/reactionModel');
const presenceStore = require('../sockets/presenceStore');

function handleRegisterSocket(io, socket) {
    return async function registerSocket(username) {
        presenceStore.setUserOnline(username, socket.id);
        await userModel.setUserOnlineStatus(username, true);
        io.emit('online_users', presenceStore.getOnlineUsernames());
    };
}

function handleOpenChat(io, socket) {
    return async function openChat(data) {
        presenceStore.setActiveChat(data.username, data.chattingWith);

        const viewer = await userModel.findUserByUsername(data.username);
        const otherUser = await userModel.findUserByUsername(data.chattingWith);

        if (!viewer || !otherUser) {
            return;
        }

        await messageModel.markConversationAsRead(otherUser.id, viewer.id);

        const otherSocketId = presenceStore.getSocketIdForUser(data.chattingWith);

        if (otherSocketId) {
            io.to(otherSocketId).emit('messages_read', { reader: data.username });
        }
    };
}

function handleTyping(io) {
    return function typing(data) {
        const receiverSocketId = presenceStore.getSocketIdForUser(data.receiver);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('show_typing', { sender: data.sender });
        }
    };
}

function handleStopTyping(io) {
    return function stopTyping(data) {
        const receiverSocketId = presenceStore.getSocketIdForUser(data.receiver);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('hide_typing', { sender: data.sender });
        }
    };
}

async function resolveMessageStatus(senderUsername, receiverUsername) {
    const receiverSocketId = presenceStore.getSocketIdForUser(receiverUsername);

    if (!receiverSocketId) {
        return 'sent';
    }

    if (presenceStore.isChatActiveBetween(receiverUsername, senderUsername)) {
        return 'read';
    }

    return 'delivered';
}

function handleSendMessage(io) {
    return async function sendMessage(data) {
        const sender = await userModel.findUserByUsername(data.sender);
        const receiver = await userModel.findUserByUsername(data.receiver);

        if (!sender || !receiver) {
            return;
        }

        const messageId = await messageModel.createMessage(
            sender.id,
            receiver.id,
            data.content || null,
            data.mediaUrl || null,
            {
                replyToId: data.replyToId || null,
                mediaType: data.mediaType || null,
                mediaName: data.mediaName || null,
                mediaSize: data.mediaSize || null
            }
        );

        const status = await resolveMessageStatus(data.sender, data.receiver);
        await messageModel.markLatestMessageStatus(sender.id, receiver.id, status);

        const savedMessage = await messageModel.getMessageById(messageId);

        const receiverSocketId = presenceStore.getSocketIdForUser(data.receiver);
        const senderSocketId = presenceStore.getSocketIdForUser(data.sender);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', savedMessage);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit('receive_message', savedMessage);
        }
    };
}

function handleForwardMessage(io) {
    return async function forwardMessage(data) {
        const original = await messageModel.getMessageById(data.messageId);
        const sender = await userModel.findUserByUsername(data.sender);
        const receiver = await userModel.findUserByUsername(data.receiver);

        if (!original || !sender || !receiver) {
            return;
        }

        const newMessageId = await messageModel.createMessage(
            sender.id,
            receiver.id,
            original.content,
            original.mediaUrl,
            {
                forwardedFromId: original.id,
                mediaType: original.mediaType,
                mediaName: original.mediaName,
                mediaSize: original.mediaSize
            }
        );

        const status = await resolveMessageStatus(data.sender, data.receiver);
        await messageModel.markLatestMessageStatus(sender.id, receiver.id, status);

        const savedMessage = await messageModel.getMessageById(newMessageId);

        const receiverSocketId = presenceStore.getSocketIdForUser(data.receiver);
        const senderSocketId = presenceStore.getSocketIdForUser(data.sender);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', savedMessage);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit('receive_message', savedMessage);
        }
    };
}

function handleReactToMessage(io) {
    return async function reactToMessage(data) {
        const user = await userModel.findUserByUsername(data.username);
        const message = await messageModel.getMessageById(data.messageId);

        if (!user || !message) {
            return;
        }

        if (data.emoji) {
            await reactionModel.upsertReaction(data.messageId, user.id, data.emoji);
        } else {
            await reactionModel.removeReaction(data.messageId, user.id);
        }

        const reactions = await reactionModel.getReactionsForMessage(data.messageId);
        const payload = { messageId: data.messageId, reactions };

        [message.sender, message.receiver].forEach(function notifyParticipant(username) {
            const socketId = presenceStore.getSocketIdForUser(username);
            if (socketId) {
                io.to(socketId).emit('message_reaction_updated', payload);
            }
        });
    };
}

function handleDisconnect(io, socket) {
    return async function disconnect() {
        const username = presenceStore.removeUserBySocketId(socket.id);

        if (username) {
            await userModel.setUserOnlineStatus(username, false);
            await userModel.refreshLastSeen(username);
        }

        io.emit('online_users', presenceStore.getOnlineUsernames());
    };
}

function registerChatSocketHandlers(io, socket) {
    socket.on('register_socket', handleRegisterSocket(io, socket));
    socket.on('open_chat', handleOpenChat(io, socket));
    socket.on('typing', handleTyping(io));
    socket.on('stopTyping', handleStopTyping(io));
    socket.on('send_message', handleSendMessage(io));
    socket.on('forward_message', handleForwardMessage(io));
    socket.on('react_to_message', handleReactToMessage(io));
    socket.on('disconnect', handleDisconnect(io, socket));
}

module.exports = {
    registerChatSocketHandlers
};
