const db = require('../config/db');

async function hideMessageForUser(messageId, userId) {
    await db.query(
        'INSERT IGNORE INTO message_hidden_for_user (message_id, user_id) VALUES (?, ?)',
        [messageId, userId]
    );
}

async function getHiddenMessageIdsForUser(userId) {
    const [rows] = await db.query(
        'SELECT message_id FROM message_hidden_for_user WHERE user_id = ?',
        [userId]
    );
    return rows.map(row => row.message_id);
}

module.exports = {
    hideMessageForUser,
    getHiddenMessageIdsForUser
};
