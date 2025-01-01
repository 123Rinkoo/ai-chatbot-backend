const dotenv = require('dotenv');
dotenv.config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;

// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "What is the capital of India?",
//         },
//     ],
// });

// module.exports = completion;