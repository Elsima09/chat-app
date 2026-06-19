const path = require('path');

function renderLoginPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

function renderRegisterPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
}

function renderChatPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'));
}

module.exports = {
    renderLoginPage,
    renderRegisterPage,
    renderChatPage
};
