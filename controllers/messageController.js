const userModel = require('../models/userModel');
const messageModel = require('../models/messageModel');
const hiddenMessageModel = require('../models/hiddenMessageModel');
const reactionModel = require('../models/reactionModel');
const starModel = require('../models/starModel');

function attachReactionsToMessages(messages, reactionRows) {
    const reactionsByMessageId = {};

    reactionRows.forEach(function groupReaction(row) {
        if (!reactionsByMessageId[row.message_id]) {
            reactionsByMessageId[row.message_id] = [];
        }
        reactionsByMessageId[row.message_id].push({ emoji: row.emoji, username: row.username });
    });

    return messages.map(function attachReactions(msg) {
        msg.reactions = reactionsByMessageId[msg.id] || [];
        return msg;
    });
}

async function getConversation(req, res) {
    const { user1, user2 } = req.params;
    const userA = await userModel.findUserByUsername(user1);
    const userB = await userModel.findUserByUsername(user2);

    if (!userA || !userB) {
        return res.json([]);
    }

    const messages = await messageModel.getConversationBetween(userA.id, userB.id);
    const hiddenIds = await hiddenMessageModel.getHiddenMessageIdsForUser(userA.id);
    const hiddenIdSet = new Set(hiddenIds);
    const visibleMessages = messages.filter(msg => !hiddenIdSet.has(msg.id));

    const reactionRows = await reactionModel.getReactionsForMessageIds(visibleMessages.map(msg => msg.id));
    res.json(attachReactionsToMessages(visibleMessages, reactionRows));
}

async function getLastMessages(req, res) {
    const me = await userModel.findUserByUsername(req.params.me);

    if (!me) {
        return res.json([]);
    }

    const messages = await messageModel.getLastMessagesForUser(me.id);
    res.json(messages);
}

async function getUnreadCounts(req, res) {
    const me = await userModel.findUserByUsername(req.params.me);

    if (!me) {
        return res.json([]);
    }

    const unreadCounts = await messageModel.getUnreadCountsForUser(me.id);
    res.json(unreadCounts);
}

async function deleteForEveryone(req, res) {
    await messageModel.markDeletedForEveryone(req.params.id);

    const io = req.app.get('io');
    io.emit('message_deleted_for_everyone', { id: req.params.id });

    res.json({ success: true });
}

async function deleteForMe(req, res) {
    const user = await userModel.findUserByUsername(req.body.username);

    if (!user) {
        return res.json({ success: false });
    }

    await hiddenMessageModel.hideMessageForUser(req.params.id, user.id);
    res.json({ success: true });
}

async function starMessage(req, res) {
    const user = await userModel.findUserByUsername(req.body.username);

    if (!user) {
        return res.json({ success: false });
    }

    await starModel.starMessage(req.params.id, user.id);
    res.json({ success: true });
}

async function unstarMessage(req, res) {
    const user = await userModel.findUserByUsername(req.body.username);

    if (!user) {
        return res.json({ success: false });
    }

    await starModel.unstarMessage(req.params.id, user.id);
    res.json({ success: true });
}

async function getStarredMessages(req, res) {
    const user = await userModel.findUserByUsername(req.params.username);

    if (!user) {
        return res.json([]);
    }

    const rows = await starModel.getStarredMessagesForUser(user.id);
    res.json(rows.map(messageModel.mapMessageRow));
}

module.exports = {
    getConversation,
    getLastMessages,
    getUnreadCounts,
    deleteForEveryone,
    deleteForMe,
    starMessage,
    unstarMessage,
    getStarredMessages
};
