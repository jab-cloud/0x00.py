## 2026-05-19 - [Accessible Notebook Images]
**Learning:** Decorative elements in Jupyter Notebooks (like dividers or logo placeholders) should have empty alt text `![]()` to prevent screen readers from announcing redundant or non-informative file names, while informative images (like ER diagrams) require descriptive alt text for full accessibility.
**Action:** Audit notebooks for image patterns and apply empty alt text to decorative dividers and descriptive alt text to functional diagrams using programmatic JSON editing to maintain file integrity.
