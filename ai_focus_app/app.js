document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const focusToggle = document.getElementById('focus-toggle');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');
    const streakEl = document.getElementById('streak-count');
    const scoreEl = document.getElementById('productivity-score');
    const blockInput = document.getElementById('block-input');
    const addBlockBtn = document.getElementById('add-block-btn');
    const blockedList = document.getElementById('blocked-list');
    const challengeDiv = document.getElementById('protection-challenge');
    const mathProblemEl = document.getElementById('math-problem');
    const challengeAnswerEl = document.getElementById('challenge-answer');
    const verifyChallengeBtn = document.getElementById('verify-challenge');

    // State
    let isFocusMode = false;
    let currentChallenge = null;
    let blockedApps = JSON.parse(localStorage.getItem('blockedApps')) || ['facebook.com', 'youtube.com'];
    let userStats = JSON.parse(localStorage.getItem('userStats')) || { streak: 5, score: 85 };

    // Initialize UI
    updateStatsUI();
    renderBlockedList();

    // Focus Mode Toggle
    focusToggle.addEventListener('click', () => {
        if (isFocusMode) {
            // Simulated Uninstall/Exit Protection
            showChallenge();
        } else {
            enterFocusMode();
        }
    });

    function enterFocusMode() {
        isFocusMode = true;
        focusToggle.textContent = 'Exit Focus Mode';
        focusToggle.classList.add('active');
        focusToggle.setAttribute('aria-pressed', 'true');
        document.body.style.backgroundColor = '#fff5f5';
        addMessage('coach', 'Focus Mode activated. I will block distracting apps now. Stay focused!');

        // Increase score slightly when starting focus mode
        userStats.score = Math.min(100, userStats.score + 1);
        saveStats();
    }

    function exitFocusMode() {
        isFocusMode = false;
        focusToggle.textContent = 'Enter Focus Mode';
        focusToggle.classList.remove('active');
        focusToggle.setAttribute('aria-pressed', 'false');
        document.body.style.backgroundColor = '#f0f4f8';
        challengeDiv.classList.add('hidden');
        addMessage('coach', 'Focus Mode deactivated. Great work! Take a short break.');
    }

    // Protection Challenge
    function showChallenge() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        currentChallenge = a + b;
        mathProblemEl.textContent = `${a} + ${b} = ?`;
        challengeDiv.classList.remove('hidden');
        challengeAnswerEl.value = '';
        challengeAnswerEl.focus();
    }

    verifyChallengeBtn.addEventListener('click', () => {
        if (parseInt(challengeAnswerEl.value) === currentChallenge) {
            exitFocusMode();
        } else {
            addMessage('coach', "Wrong answer! I'm keeping Focus Mode active to protect your productivity.");
            showChallenge();
        }
    });

    // App Blocker
    addBlockBtn.addEventListener('click', () => {
        const app = blockInput.value.trim();
        if (app && !blockedApps.includes(app)) {
            blockedApps.push(app);
            saveBlockedApps();
            renderBlockedList();
            blockInput.value = '';
        }
    });

    function renderBlockedList() {
        blockedList.innerHTML = '';
        blockedApps.forEach((app, index) => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = app;

            const btn = document.createElement('button');
            btn.className = 'remove-block';
            btn.setAttribute('data-index', index);
            btn.setAttribute('aria-label', `Remove ${app}`);
            btn.textContent = '×';

            li.appendChild(span);
            li.appendChild(btn);
            blockedList.appendChild(li);
        });
    }

    blockedList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-block')) {
            const index = e.target.getAttribute('data-index');
            blockedApps.splice(index, 1);
            saveBlockedApps();
            renderBlockedList();
        }
    });

    // AI Coach Chat
    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage('user', text);
            chatInput.value = '';

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

    // Helpers
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function updateStatsUI() {
        streakEl.textContent = `🔥 ${userStats.streak} Day Streak`;
        scoreEl.textContent = `📈 Score: ${userStats.score}`;
    }

    function saveStats() {
        localStorage.setItem('userStats', JSON.stringify(userStats));
        updateStatsUI();
    }

    function saveBlockedApps() {
        localStorage.setItem('blockedApps', JSON.stringify(blockedApps));
    }
});
