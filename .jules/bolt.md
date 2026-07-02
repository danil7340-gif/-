
## 2024-07-02 - Parallelization of Independent Asynchronous Operations
**Learning:** Sequential execution of independent asynchronous data fetching and post generation significantly delayed the application's time-to-interactive and initial content display.
**Action:** Use Promise.all to parallelize storage fetches and concurrent generation calls.

## 2024-07-02 - Static Font Loading with Preconnect Hints
**Learning:** Dynamic font injection via JavaScript causes layout shifts and delays First Contentful Paint.
**Action:** Move font loading to index.html using static link tags and add preconnect/dns-prefetch hints for font domains.
