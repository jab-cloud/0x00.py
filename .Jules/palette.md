## 2025-05-14 - Accessible Jupyter Notebooks
**Learning:** Decorative elements in Jupyter Notebooks, such as custom dividers or logos, can create unnecessary noise for screen reader users if they have descriptive alt text that doesn't add value to the content. Empty alt text (`![]()` or `alt=""`) is preferred for these elements to signal they should be ignored by assistive technologies.
**Action:** Always audit Jupyter Notebooks for decorative images and ensure they use empty alt text, while informative images (like ER diagrams) have descriptive and concise alt attributes.
