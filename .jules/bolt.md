## 2025-06-24 - Optimizing Critical Path and Asset Loading

**Learning:** Moving Google Fonts and global CSS from dynamic JavaScript injection to static HTML and standalone CSS files significantly improves FCP and CLS. Parallelizing storage fetches with `Promise.all` reduces initialization lag. Correct prioritization of LCP images with `fetchpriority="high"` and `loading="eager"` while lazy-loading others optimizes bandwidth and rendering speed.

**Action:** Always check for dynamic asset injections in React components and move them to static files when possible. Audit image loading strategies for LCP optimization. Parallelize independent storage/API calls during app initialization.
