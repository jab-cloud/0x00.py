## 2026-05-20 - Improving accessibility in Jupyter Notebooks
**Learning:** For decorative elements like dividers in Jupyter Notebooks, using empty alt text (Markdown: `![]()`, HTML: `alt=""`) prevents screen reader noise and improves accessibility. When programmatically editing notebook JSON, it's critical to maintain the original indentation (e.g., 2 spaces) and avoid escaping non-ASCII characters to keep diffs clean and files readable.
**Action:** Always audit Jupyter Notebooks for image accessibility and use programmatic tools to apply fixes consistently while preserving file structure.
