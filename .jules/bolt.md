## 2025-05-15 - Asynchronous Side Effects and State

**Learning:** React state updaters (`setState(prev => ... )`) must be pure and synchronous. You cannot perform asynchronous side effects (like database/storage writes) inside them. Furthermore, because `setState` is asynchronous and batched, you cannot rely on the state being updated immediately after calling `setState`.

**Action:** To perform a side effect that depends on the *new* state, calculate the next state value, update the state, and then use that calculated value for the side effect. If you need to ensure asynchronous operations always have access to the latest state (to avoid race conditions), use a `useRef` to track the state value in parallel.

## 2025-05-15 - Effective Memoization of List Items

**Learning:** `React.memo` is only effective if the props passed to the component have stable references. Inline arrow functions (e.g., `onClick={() => handle(item)}`) create a new function reference on every render of the parent, causing all memoized children to re-render.

**Action:** Pass stable callbacks to children (using `useCallback`). If the callback needs item-specific data, either pass the item to a generic stable handler or have the child component wrap the stable handler with its own `useCallback` that includes the item in its dependency array.
