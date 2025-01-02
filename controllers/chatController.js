const openai = require('../config/openai');
const redisClient = require('../utils/redis');
const getChatResponse = async (req, res) => {
    try {
        const io = req.io;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`User message: ${message}`);
        const cachedResponse = await redisClient.get(message);
        if (cachedResponse) {
            io.emit('botStoppedTyping');
            return res.json({ message: "From Cache", reply: cachedResponse });
        }
        else {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            });
            await redisClient.set(message, response.choices[0].message.content.trim());
            io.emit('botStoppedTyping');
            res.json({ message: "From AI", reply: response.choices[0].message.content.trim() });
        }
    } catch (error) {
        console.error('Error fetching AI response:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getChatResponse };
