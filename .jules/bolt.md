## 2025-06-29 - Parallelized Initialization and Image Prioritization
**Learning:** Sequential `await` calls in `loadAndInit` were creating a bottleneck during the initial application hydrate. Even with small data sets, the overhead of multiple storage trips adds up, especially on mobile or slower devices. Additionally, neglecting image prioritization (LCP) was a major performance oversight in the original layout.

**Action:** Always parallelize independent asynchronous data fetching operations using `Promise.all`. For frontend assets, explicitly set `fetchpriority="high"` for images that are likely to be the Largest Contentful Paint (LCP) to improve perceived performance and core web vitals. Use `loading="lazy"` for everything else below the fold.
