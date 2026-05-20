if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Service Worker registered');

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    }
                });
            });
        }).catch(err => console.log('Service Worker registration failed', err));
    });
}

function showUpdateToast() {
    const toast = document.createElement('div');
    toast.className = 'toast update-toast';
    toast.style.cursor = 'pointer';
    toast.style.backgroundColor = '#2c5282';
    toast.innerHTML = '✨ New version available! Click to update.';

    document.getElementById('toast-container').appendChild(toast);

    toast.addEventListener('click', () => {
        window.location.reload();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const focusToggle = document.getElementById('focus-toggle');
    const timerDisplay = document.getElementById('timer-display');
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
    const safeGuardToggle = document.getElementById('safe-guard-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const goalInput = document.getElementById('goal-input');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalsList = document.getElementById('goals-list');

    // Verses Database
    const verses = [
        { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23", tags: ["diligence", "work", "focus"] },
        { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13", tags: ["strength", "tired", "motivation"] },
        { text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", ref: "2 Timothy 1:7", tags: ["peace", "mind", "anxiety"] },
        { text: "Let your eyes look straight ahead; fix your gaze directly before you.", ref: "Proverbs 4:25", tags: ["focus", "distracted"] },
        { text: "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied.", ref: "Proverbs 13:4", tags: ["diligence", "productivity"] },
        { text: "Commit your work to the Lord, and your plans will be established.", ref: "Proverbs 16:3", tags: ["work", "planning"] },
        { text: "Flee from sexual immorality. All other sins a person commits are outside the body, but whoever sins sexually, sins against their own body.", ref: "1 Corinthians 6:18", tags: ["purity"] },
        { text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.", ref: "Philippians 4:8", tags: ["purity"] },
        { text: "I made a covenant with my eyes not to look lustfully at a young woman.", ref: "Job 31:1", tags: ["purity"] }
    ];

    // State
    let isFocusMode = false;
    let currentChallenge = null;
    let blockedApps = JSON.parse(localStorage.getItem('blockedApps')) || ['facebook.com', 'youtube.com'];
    let userStats = JSON.parse(localStorage.getItem('userStats')) || { streak: 5, score: 85 };
    let isSafeGuardActive = JSON.parse(localStorage.getItem('isSafeGuardActive')) || false;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    // Timer State
    let timerInterval = null;
    let timeLeft = 25 * 60;
    let isBreak = false;

    // Initialize UI
    safeGuardToggle.checked = isSafeGuardActive;
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    updateStatsUI();
    renderBlockedList();
    renderGoals();
    updateTimerDisplay();

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', currentTheme);
    });

    // Safe Guard Toggle
    safeGuardToggle.addEventListener('change', () => {
        isSafeGuardActive = safeGuardToggle.checked;
        localStorage.setItem('isSafeGuardActive', JSON.stringify(isSafeGuardActive));
        if (isSafeGuardActive) {
            addMessage('coach', 'AI Safe-Search Guard active. I will now monitor and block restricted content.');
            showToast('Safe-Search Guard Enabled');
        } else {
            addMessage('coach', 'Safe-Search Guard disabled. Be careful out there.');
        }
    });

    // Focus Mode Toggle
    focusToggle.addEventListener('click', () => {
        if (isFocusMode) {
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
        document.body.style.backgroundColor = currentTheme === 'light' ? '#fff5f5' : '#4a2c2c';

        const focusVerse = getRandomVerseByTag('focus');
        addMessage('coach', `Focus Mode activated. ${focusVerse.text} (${focusVerse.ref})`);
        showToast(`Motivation: "${focusVerse.text}" - ${focusVerse.ref}`);

        startTimer();

        userStats.score = Math.min(100, userStats.score + 1);
        saveStats();
    }

    function exitFocusMode() {
        isFocusMode = false;
        focusToggle.textContent = 'Enter Focus Mode';
        focusToggle.classList.remove('active');
        focusToggle.setAttribute('aria-pressed', 'false');
        document.body.style.backgroundColor = '';
        challengeDiv.classList.add('hidden');
        addMessage('coach', 'Focus Mode deactivated. Great work! Take a short break.');

        stopTimer();
        timeLeft = 25 * 60;
        isBreak = false;
        updateTimerDisplay();
    }

    // Timer Logic
    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - FocusMind`;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                handleTimerComplete();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function handleTimerComplete() {
        stopTimer();
        if (!isBreak) {
            isBreak = true;
            timeLeft = 5 * 60;
            addMessage('coach', 'Pomodoro complete! Take a 5-minute break. You earned it.');
            showToast('Time for a break!');
            userStats.score = Math.min(100, userStats.score + 5);
            saveStats();
        } else {
            isBreak = false;
            timeLeft = 25 * 60;
            addMessage('coach', 'Break over! Ready for another focused session?');
            showToast('Back to work!');
        }
        updateTimerDisplay();
        if (isFocusMode) startTimer();
    }

    // Goals Logic
    addGoalBtn.addEventListener('click', () => {
        const text = goalInput.value.trim();
        if (text && goals.length < 3) {
            goals.push({ text, completed: false });
            goalInput.value = '';
            saveGoals();
            renderGoals();
        }
    });

    function renderGoals() {
        goalsList.innerHTML = '';
        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.className = goal.completed ? 'completed' : '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = goal.completed;
            checkbox.setAttribute('data-index', index);

            const span = document.createElement('span');
            span.textContent = goal.text;

            const btn = document.createElement('button');
            btn.className = 'remove-block';
            btn.setAttribute('data-index', index);
            btn.style.marginLeft = 'auto';
            btn.textContent = '×';

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(btn);
            goalsList.appendChild(li);
        });
    }

    goalsList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = e.target.getAttribute('data-index');
            goals[index].completed = e.target.checked;
            if (goals[index].completed) {
                showToast('Goal achieved! Great job.');
                userStats.score = Math.min(100, userStats.score + 2);
                saveStats();
            }
            saveGoals();
            renderGoals();
        }
    });

    goalsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-block')) {
            const index = e.target.getAttribute('data-index');
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        }
    });

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

                const restrictedKeywords = ['porn', 'sex', 'adult', 'pussy', 'nude'];
                const containsRestricted = restrictedKeywords.some(kw => text.includes(kw));

                if (containsRestricted) {
                    relevantVerse = getRandomVerseByTag('purity');
                    response = `I'm sorry, I cannot discuss that. Focus on what is pure and good. "${relevantVerse.text}" (${relevantVerse.ref})`;
                    addMessage('coach', response);
                    return;
                }

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

    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
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
