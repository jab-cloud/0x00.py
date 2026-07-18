## 2026-05-20 - AI Focus + Dopamine Control App Kickoff

**Learning:** Initializing the AI Focus + Dopamine Control App project with a focus on micro-UX and accessibility. The app aims to provide a calm, non-addictive interface for focus management.

**Action:** Created `ai_focus_app` directory and started the development of the MVP frontend.

## 2026-05-20 - FocusMind MVP Completion

**Learning:** Developing a PWA for dopamine control requires combining behavioral triggers (math challenges) with supportive resources (Bible verses). Accessibility and security (XSS) must be handled early to avoid regressions. PWA installation relies heavily on valid icon assets and HTTPS.

**Action:** Developed the FocusMind MVP with Pomodoro, AI Coach, and security features. Implemented XSS protection in list rendering. Added comprehensive deployment and testing documentation. Cleaned up build logs and temporary files after visual verification.

## 2026-07-18 - Semantic Form Submission & Accessible Custom Toggles

**Learning:** For inputs with add/submit buttons, wrapping them in native `<form>` elements provides seamless mobile keyboard integration and "Enter" key submit handlers without adding complex keypress listeners. Additionally, standard custom toggles must explicitly use associated `<label for="...">` descriptive text rather than sibling `<span>` tags to ensure screen readers associate the description correctly and to expand the clickable hit area.

**Action:** Upgraded the Goals and Blocked Apps sections to use semantic HTML forms. Improved switch accessibility by replacing the guard toggle text span with an associated label.
