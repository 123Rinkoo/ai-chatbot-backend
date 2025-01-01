const express = require('express');
const app = express();
const http = require('http').createServer(app);
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chat');

require('dotenv').config();
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
}));

// Placeholder route
app.get('/', (req, res) => res.send('Chatbot Backend is Running'));
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const connectDB = require('./config/db');
connectDB();
