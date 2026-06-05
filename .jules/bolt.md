## 2026-06-05 - [React Rendering Optimization]
**Learning:** Broad memoization of components (React.memo) and computations (useMemo) significantly reduces main-thread activity in data-heavy apps with background updates. Specifically, memoizing a component that injects styles (like GS) prevents expensive DOM thrashing on every render.
**Action:** Always memoize global style components and use useMemo for derived state like filtered lists.

## 2026-06-05 - [Pure State Updaters]
**Learning:** Moving side effects (like async storage calls) into React state updater functions violates purity and leads to unreliable persistence.
**Action:** Side effects must remain outside updaters, using the calculated next state for both the update and the side effect.
