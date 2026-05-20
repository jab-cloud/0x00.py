document.addEventListener('DOMContentLoaded', () => {
    const focusToggle = document.getElementById('focus-toggle');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');

    let isFocusMode = false;

    // Focus Mode Toggle
    focusToggle.addEventListener('click', () => {
        isFocusMode = !isFocusMode;
        if (isFocusMode) {
            focusToggle.textContent = 'Exit Focus Mode';
            focusToggle.classList.add('active');
            focusToggle.setAttribute('aria-pressed', 'true');
            document.body.style.backgroundColor = '#fff5f5'; // Light red tint for focus
            addMessage('coach', 'Focus Mode activated. I will block distracting apps now. Stay focused!');
        } else {
            focusToggle.textContent = 'Enter Focus Mode';
            focusToggle.classList.remove('active');
            focusToggle.setAttribute('aria-pressed', 'false');
            document.body.style.backgroundColor = '#f0f4f8';
            addMessage('coach', 'Focus Mode deactivated. Great work! Take a short break.');
        }
    });

    // AI Coach Chat
    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage('user', text);
            chatInput.value = '';

            // Mock AI Response
            setTimeout(() => {
                const coachResponses = [
                    "You're doing great! Keep it up.",
                    "Remember your goal: a focused mind is a happy mind.",
                    "Need a break? A 5-minute walk can recharge your dopamine levels naturally.",
                    "I'm here to keep you accountable. What's your next task?"
                ];
                const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)];
                addMessage('coach', randomResponse);
            }, 1000);
        }
    };

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
