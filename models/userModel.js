const db = require('../config/db');

async function createUser(username, hashedPassword) {
    const [result] = await db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
    return result.insertId;
}

async function findUserByUsername(username) {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0] || null;
}

async function findUserById(id) {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

async function getAllUsers() {
    const [rows] = await db.query(
        'SELECT id, username, avatar, avatar_url, is_online, last_seen FROM users'
    );
    return rows;
}

async function updateAvatarUrl(username, avatarUrl) {
    await db.query(
        'UPDATE users SET avatar_url = ? WHERE username = ?',
        [avatarUrl, username]
    );
}

async function getLastSeenByUsername(username) {
    const [rows] = await db.query(
        'SELECT last_seen FROM users WHERE username = ?',
        [username]
    );
    return rows[0] || null;
}

async function setUserOnlineStatus(username, isOnline) {
    await db.query(
        'UPDATE users SET is_online = ? WHERE username = ?',
        [isOnline, username]
    );
}

async function refreshLastSeen(username) {
    await db.query(
        'UPDATE users SET last_seen = NOW() WHERE username = ?',
        [username]
    );
}

async function updatePasswordHash(username, hashedPassword) {
    await db.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, username]
    );
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    getAllUsers,
    updateAvatarUrl,
    getLastSeenByUsername,
    setUserOnlineStatus,
    refreshLastSeen,
    updatePasswordHash
};
