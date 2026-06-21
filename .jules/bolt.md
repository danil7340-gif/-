## 2026-06-21 - Optimized Frontend Resource Loading and Styles

**Learning:** Injecting global styles and fonts via JavaScript in React components causes redundant style tag injections and delays First Contentful Paint (FCP). Static assets should be moved to the HTML/CSS pipeline for better performance.

**Action:** Move global CSS to a standalone `index.css` file and Google Fonts to `index.html` with `preconnect` hints. Use `loading="lazy"` on images to defer loading of off-screen content.
