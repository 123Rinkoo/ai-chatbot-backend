const express = require('express');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chat');
const { createServer } = require('http');
const path = require('path');
const app = express();
const server = createServer(app);
const io = socketIo(server);

dotenv.config();
connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/', (req, res) => {
    res.send('AI Chatbot Backend is running');
});

app.use('/api', chatRoutes);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for "user typing" event
    socket.on('userFinishedTyping', () => {
        // Notify all clients that the bot is typing
        io.emit('botTyping');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server and listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
