const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const LEGACY_HASH_PREFIX = '$2';

async function registerUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: 'Username dan password wajib diisi' });
    }

    const existingUser = await userModel.findUserByUsername(username);

    if (existingUser) {
        return res.json({ success: false, message: 'Username sudah dipakai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(username, hashedPassword);

    res.json({ success: true, message: 'Register berhasil' });
}

async function isPasswordValid(plainPassword, storedPassword) {
    if (storedPassword.startsWith(LEGACY_HASH_PREFIX)) {
        return bcrypt.compare(plainPassword, storedPassword);
    }
    return plainPassword === storedPassword;
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    const user = await userModel.findUserByUsername(username);

    if (!user) {
        return res.json({ success: false, message: 'Username / Password salah' });
    }

    const passwordValid = await isPasswordValid(password, user.password);

    if (!passwordValid) {
        return res.json({ success: false, message: 'Username / Password salah' });
    }

    if (!user.password.startsWith(LEGACY_HASH_PREFIX)) {
        const upgradedHash = await bcrypt.hash(password, 10);
        await userModel.updatePasswordHash(username, upgradedHash);
    }

    res.json({
        success: true,
        user: { id: user.id, username: user.username, avatar: user.avatar, avatarUrl: user.avatar_url }
    });
}

module.exports = {
    registerUser,
    loginUser
};
