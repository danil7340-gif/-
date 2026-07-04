## 2025-03-24 - Parallelize Storage Initialization
**Learning:** Sequential `await` calls for independent storage fetches (like `aiblog_posts_v3` and `aiblog_comments_v1`) introduce unnecessary latency during the application's critical path (loading state).
**Action:** Use `Promise.all` to fetch multiple independent collections from storage concurrently.

## 2025-03-24 - Structural Fixes for Vite
**Learning:** Vite requires the `.jsx` extension to correctly parse files containing JSX. Recommending a minimal structural fix (updating `index.html` to point to root files) is preferred over a project-wide `src/` migration to minimize PR noise.
**Action:** Rename files with JSX to `.jsx` and ensure `index.html` entry points match the actual file structure.
