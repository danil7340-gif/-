## 2025-05-22 - Parallelize independent storage fetches
**Learning:** Sequential await calls for independent storage data (e.g., posts and comments) creates an unnecessary bottleneck during application initialization.
**Action:** Use Promise.all() to fetch independent resources in parallel, reducing the blocking time of the loading state.
