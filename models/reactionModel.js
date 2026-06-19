const db = require('../config/db');

async function upsertReaction(messageId, userId, emoji) {
    await db.query(
        `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE emoji = ?`,
        [messageId, userId, emoji, emoji]
    );
}

async function removeReaction(messageId, userId) {
    await db.query(
        'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?',
        [messageId, userId]
    );
}

async function getReactionsForMessage(messageId) {
    const [rows] = await db.query(
        `SELECT mr.emoji, u.username
         FROM message_reactions mr
         JOIN users u ON u.id = mr.user_id
         WHERE mr.message_id = ?`,
        [messageId]
    );
    return rows;
}

async function getReactionsForMessageIds(messageIds) {
    if (messageIds.length === 0) {
        return [];
    }

    const [rows] = await db.query(
        `SELECT mr.message_id, mr.emoji, u.username
         FROM message_reactions mr
         JOIN users u ON u.id = mr.user_id
         WHERE mr.message_id IN (?)`,
        [messageIds]
    );
    return rows;
}

module.exports = {
    upsertReaction,
    removeReaction,
    getReactionsForMessage,
    getReactionsForMessageIds
};
