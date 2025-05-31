  



const myFullName = "John Doe";

const descriptions = [
    "I'm John Doe, a curious coder who loves turning ideas into reality with clean code.",
    "Hey, I'm John Doe! I build cool apps and enjoy learning new tech in my free time.",
    "I'm John Doe, a developer passionate about creating seamless user experiences.",
    "Hi there! I'm John Doe, a tech enthusiast who crafts innovative digital solutions.",
    "I'm John Doe, always experimenting with code to build something unique and useful."
];

const myDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

function toggleTheme() {
    console.log('Toggling theme...');
    document.body.classList.toggle('dark-theme');
    const button = document.querySelector('.theme-toggle');
    button.textContent = document.body.classList.contains('dark-theme') ? 'Light Theme' : 'Dark Theme';
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function openChat() {
    const chatOverlay = document.getElementById('chatOverlay');
    const chatBody = document.getElementById('chatBody');
    chatBody.innerHTML = ''; // Clear previous messages
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot-message';
    initialMessage.textContent = `Hy i am ${myFullName}, what do u want to know about me?`;
    chatBody.appendChild(initialMessage);
    chatOverlay.style.display = 'flex';
    chatBody.scrollTop = chatBody.scrollHeight;
}

function closeChat() {
    document.getElementById('chatOverlay').style.display = 'none';
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    const message = input.value.trim();

    if (message) {
        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = message;
        chatBody.appendChild(userMessage);

        // Clear input
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.style.display = 'block';
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Call Gemini API
        try {
            const apiKey = "AIzaSyC_e3_7kvGu1D9An1PxA4LgsvmKRPdIfqw";
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= ' + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `User_message:${message}. Reply naturally to the usermessage and if required then answer based on: ${myDescription} or just simply give friendly reply .and reply in a way that John Doe is himself talking .reply in short sentences`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const botReply = data.candidates ? data.candidates[0].content.parts[0].text : "Thanks for asking! I'm happy to chat.";

            // Remove typing indicator
            typingIndicator.remove();

            // Display bot response
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = botReply;
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        } catch (error) {
            console.error('API Error:', error);
            // Remove typing indicator
            typingIndicator.remove();
            // Fallback dummy response
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = "Hey, something went wrong. But I'm still here! What's up?";
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
}

// Close chat on clicking outside
document.getElementById('chatOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeChat();
    }
});

// Send message on Enter key
document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

