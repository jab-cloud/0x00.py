if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

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
    const toastContainer = document.getElementById('toast-container');

    // Verses Database
    const verses = [
        { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23", tags: ["diligence", "work", "focus"] },
        { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13", tags: ["strength", "tired", "motivation"] },
        { text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", ref: "2 Timothy 1:7", tags: ["peace", "mind", "anxiety"] },
        { text: "Let your eyes look straight ahead; fix your gaze directly before you.", ref: "Proverbs 4:25", tags: ["focus", "distracted"] },
        { text: "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied.", ref: "Proverbs 13:4", tags: ["diligence", "productivity"] },
        { text: "Commit your work to the Lord, and your plans will be established.", ref: "Proverbs 16:3", tags: ["work", "planning"] }
    ];

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

        const focusVerse = getRandomVerseByTag('focus');
        addMessage('coach', `Focus Mode activated. ${focusVerse.text} (${focusVerse.ref})`);
        showToast(`Motivation: "${focusVerse.text}" - ${focusVerse.ref}`);

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
        const text = chatInput.value.trim().toLowerCase();
        if (text) {
            addMessage('user', text);
            chatInput.value = '';

            setTimeout(() => {
                let response = "";
                let relevantVerse = null;

                if (text.includes('tired') || text.includes('weak')) {
                    relevantVerse = getRandomVerseByTag('strength');
                } else if (text.includes('distracted') || text.includes('focus')) {
                    relevantVerse = getRandomVerseByTag('focus');
                } else if (text.includes('lazy') || text.includes('work')) {
                    relevantVerse = getRandomVerseByTag('diligence');
                } else if (text.includes('stress') || text.includes('anxious')) {
                    relevantVerse = getRandomVerseByTag('peace');
                }

                if (relevantVerse) {
                    response = `I understand. Remember this: "${relevantVerse.text}" (${relevantVerse.ref})`;
                } else {
                    const coachResponses = [
                        "You're doing great! Keep it up.",
                        "Remember your goal: a focused mind is a happy mind.",
                        "Need a break? A 5-minute walk can recharge your dopamine levels naturally.",
                        "I'm here to keep you accountable. What's your next task?"
                    ];
                    response = coachResponses[Math.floor(Math.random() * coachResponses.length)];
                }

                addMessage('coach', response);
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

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    function getRandomVerseByTag(tag) {
        const filtered = verses.filter(v => v.tags.includes(tag));
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
});
