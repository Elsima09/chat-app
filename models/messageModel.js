const db = require('../config/db');

function mapMessageRow(row) {
    return {
        id: row.id,
        sender: row.sender,
        receiver: row.receiver,
        content: row.content,
        mediaUrl: row.media_url,
        mediaType: row.media_type,
        mediaName: row.media_name,
        mediaSize: row.media_size,
        status: row.status,
        createdAt: row.created_at,
        replyToId: row.reply_to_id,
        forwardedFromId: row.forwarded_from_id,
        isDeletedForEveryone: !!row.deleted_for_everyone
    };
}

async function createMessage(senderId, receiverId, content, mediaUrl, options = {}) {
    const [result] = await db.query(
        `INSERT INTO messages
            (sender_id, receiver_id, content, media_url, reply_to_id, forwarded_from_id, media_type, media_name, media_size)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            senderId,
            receiverId,
            content,
            mediaUrl,
            options.replyToId || null,
            options.forwardedFromId || null,
            options.mediaType || null,
            options.mediaName || null,
            options.mediaSize || null
        ]
    );
    return result.insertId;
}

async function getMessageById(id) {
    const [rows] = await db.query(
        `SELECT m.*, su.username AS sender, ru.username AS receiver
         FROM messages m
         JOIN users su ON su.id = m.sender_id
         JOIN users ru ON ru.id = m.receiver_id
         WHERE m.id = ?`,
        [id]
    );
    return rows[0] ? mapMessageRow(rows[0]) : null;
}

async function getConversationBetween(userIdA, userIdB) {
    const [rows] = await db.query(
        `SELECT m.*, su.username AS sender, ru.username AS receiver
         FROM messages m
         JOIN users su ON su.id = m.sender_id
         JOIN users ru ON ru.id = m.receiver_id
         WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC`,
        [userIdA, userIdB, userIdB, userIdA]
    );
    return rows.map(mapMessageRow);
}

async function getLastMessagesForUser(userId) {
    const [rows] = await db.query(
        `SELECT m1.*, su.username AS sender, ru.username AS receiver
         FROM messages m1
         JOIN users su ON su.id = m1.sender_id
         JOIN users ru ON ru.id = m1.receiver_id
         INNER JOIN (
             SELECT
                 CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS chat_user_id,
                 MAX(id) AS latest_id
             FROM messages
             WHERE sender_id = ? OR receiver_id = ?
             GROUP BY chat_user_id
         ) m2
         ON (
             (
                 (m1.sender_id = ? AND m1.receiver_id = m2.chat_user_id)
                 OR (m1.receiver_id = ? AND m1.sender_id = m2.chat_user_id)
             )
             AND m1.id = m2.latest_id
         )
         ORDER BY m1.created_at DESC`,
        [userId, userId, userId, userId, userId]
    );
    return rows.map(mapMessageRow);
}

async function getUnreadCountsForUser(userId) {
    const [rows] = await db.query(
        `SELECT su.username AS sender, COUNT(*) AS total
         FROM messages m
         JOIN users su ON su.id = m.sender_id
         WHERE m.receiver_id = ? AND m.status != 'read'
         GROUP BY su.username`,
        [userId]
    );
    return rows;
}

async function markConversationAsRead(senderId, receiverId) {
    await db.query(
        `UPDATE messages SET status = 'read'
         WHERE sender_id = ? AND receiver_id = ? AND status != 'read'`,
        [senderId, receiverId]
    );
}

async function markLatestMessageStatus(senderId, receiverId, status) {
    await db.query(
        `UPDATE messages SET status = ?
         WHERE sender_id = ? AND receiver_id = ?
         ORDER BY id DESC LIMIT 1`,
        [status, senderId, receiverId]
    );
}

async function markDeletedForEveryone(id) {
    await db.query(
        `UPDATE messages
         SET deleted_for_everyone = 1, content = NULL, media_url = NULL,
             media_type = NULL, media_name = NULL, media_size = NULL
         WHERE id = ?`,
        [id]
    );
}

module.exports = {
    mapMessageRow,
    createMessage,
    getMessageById,
    getConversationBetween,
    getLastMessagesForUser,
    getUnreadCountsForUser,
    markConversationAsRead,
    markLatestMessageStatus,
    markDeletedForEveryone
};
