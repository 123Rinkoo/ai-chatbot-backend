const express = require('express');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chat');
const { createServer } = require('http');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());  // Parse incoming JSON requests
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
}));
app.use('/api', chatRoutes);

const server = createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New user connected: ', socket.id);

    socket.on('typing', (data) => {
        console.log('User is typing: ', data);
        socket.broadcast.emit('typing', data); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('AI Chatbot Backend is running');
});

// Start server and listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
