const db = require('../config/db');

async function starMessage(messageId, userId) {
    await db.query(
        'INSERT IGNORE INTO starred_messages (message_id, user_id) VALUES (?, ?)',
        [messageId, userId]
    );
}

async function unstarMessage(messageId, userId) {
    await db.query(
        'DELETE FROM starred_messages WHERE message_id = ? AND user_id = ?',
        [messageId, userId]
    );
}

async function getStarredMessageIdsForUser(userId) {
    const [rows] = await db.query(
        'SELECT message_id FROM starred_messages WHERE user_id = ?',
        [userId]
    );
    return rows.map(row => row.message_id);
}

async function getStarredMessagesForUser(userId) {
    const [rows] = await db.query(
        `SELECT m.*, su.username AS sender, ru.username AS receiver
         FROM starred_messages sm
         JOIN messages m ON m.id = sm.message_id
         JOIN users su ON su.id = m.sender_id
         JOIN users ru ON ru.id = m.receiver_id
         WHERE sm.user_id = ?
         ORDER BY sm.created_at DESC`,
        [userId]
    );
    return rows;
}

module.exports = {
    starMessage,
    unstarMessage,
    getStarredMessageIdsForUser,
    getStarredMessagesForUser
};
