const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userMessageInput = document.getElementById('user-message');

const appendMessage = (message, className) => {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; 
};

sendBtn.addEventListener('click', async () => {
    const message = userMessageInput.value.trim();
    if (!message) return;

    // Append user message
    appendMessage(message, 'user-message');
    userMessageInput.value = '';

    // Send message to backend
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        appendMessage(data.reply, 'bot-message');
    } catch (error) {
        appendMessage('Error: Could not get a response.', 'bot-message');
    }
});
