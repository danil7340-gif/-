# Bolt's Journal - Critical Performance Learnings

## 2025-05-15 - Journal Initialized
**Learning:** Initializing Bolt's journal for the sintez-blog project.
**Action:** Will record codebase-specific performance bottlenecks and surprising results here.

## 2026-07-03 - Storage Race Conditions in Parallel Generation
**Learning:** Parallelizing AI generation calls (`generatePost`) that modify the same shared storage collection (`aiblog_posts_v3`) causes storage race conditions and potential data corruption. Each call reads the current list and writes back the updated list, so parallel calls overwrite each other.
**Action:** Maintain sequential execution for storage-writing operations in this codebase.
