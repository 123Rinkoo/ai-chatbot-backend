const openai = require('../config/openai');

const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`User message: ${message}`);

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

        res.json({ reply: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error fetching AI response:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getChatResponse };
