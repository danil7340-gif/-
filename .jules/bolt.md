## 2025-06-28 - Initial Load Optimization
**Learning:** Sequential await calls for storage/API in `useEffect` or initialization functions create unnecessary waterfalls. Using `Promise.all` for independent data fetching (like posts and comments) noticeably speeds up the "Loading State" transition.
**Action:** Always check for independent async operations during app initialization and parallelize them.

## 2025-06-28 - Static Asset Optimization
**Learning:** Dynamic injection of Google Fonts and global CSS via JavaScript causes FCP/LCP delays and layout shifts.
**Action:** Move font links to `index.html` with `preconnect` hints and extract global CSS to a standalone file.
