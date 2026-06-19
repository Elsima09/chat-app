const userModel = require('../models/userModel');

async function listAllUsers(req, res) {
    const users = await userModel.getAllUsers();
    res.json(users);
}

async function getLastSeen(req, res) {
    const result = await userModel.getLastSeenByUsername(req.params.username);
    res.json({ last_seen: result ? result.last_seen : null });
}

async function setAvatar(req, res) {
    const { username, avatarUrl } = req.body;
    await userModel.updateAvatarUrl(username, avatarUrl);
    res.json({ success: true });
}

module.exports = {
    listAllUsers,
    getLastSeen,
    setAvatar
};
