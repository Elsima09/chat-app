require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const initSocketManager = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('io', io);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pageRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(messageRoutes);
app.use(uploadRoutes);

app.use(function handleRouteError(err, req, res, next) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

initSocketManager(io);

const port = process.env.PORT || 3000;

server.listen(port, '0.0.0.0', function onServerListening() {
    console.log('Server running on port ' + port);
});
