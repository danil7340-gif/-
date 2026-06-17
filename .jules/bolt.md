## 2025-05-22 - [Optimized CSS injection and font loading]
**Learning:** Runtime injection of global CSS via React components causes the browser to re-parse and re-apply styles on every render, which is inefficient. Similarly, dynamic font loading in JS delays resource discovery.
**Action:** Move global styles to a static CSS file and fonts to index.html with preconnect hints for faster FCP and better DOM stability.
