# Testing Guide for FocusMind

Follow this checklist to ensure your FocusMind app is working perfectly on both desktop and mobile.

## 1. PWA & Installation Testing
- [ ] **HTTPS Verification**: Ensure the app is served over HTTPS (required for PWA).
- [ ] **Install Prompt**: Open the URL on your mobile. Does the browser suggest "Install" or "Add to Home Screen"?
- [ ] **Offline Mode**: Turn on Airplane mode. Open the app. It should still load (cached by Service Worker).

## 2. Productivity Tools
- [ ] **Pomodoro Timer**: Enter Focus Mode. Does the timer count down? Does it switch to a 5-minute break at 00:00?
- [ ] **Focus Goals**: Add 3 goals. Check one off. Does your score increase? Refresh the page; are the goals still there?
- [ ] **Dark Mode**: Toggle the 🌙/☀️ icon. Does the theme change instantly and persist after refresh?

## 3. Security & Accountability
- [ ] **AI Coach Filter**: Type "porn" or "sex" into the coach chat. Does the coach refuse and provide a Bible verse (e.g., Job 31:1)?
- [ ] **Safe-Search Guard**: Enable the toggle. Does the coach confirm it's active?
- [ ] **Uninstall Protection**: Try to click "Exit Focus Mode". Does the math challenge appear? Does a wrong answer keep the app locked?

## 4. User Stats
- [ ] **Score Tracking**: Check if your productivity score increases when you start Focus Mode or complete a goal.
- [ ] **Streak Persistence**: Check back tomorrow to see if your streak count is updated (requires consecutive day usage).

## 5. Performance & Accessibility
- [ ] **Responsive Design**: Resize your browser window. Does the layout adjust correctly for mobile?
- [ ] **Keyboard Navigation**: Use the `Tab` key to navigate. Are all buttons and inputs reachable and clearly focused?
