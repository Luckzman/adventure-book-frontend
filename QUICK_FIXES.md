# Quick Fixes Checklist

## 🔴 Critical (Fix Immediately)

- [ ] **Remove all `console.log` statements** (8 found)
  - Replace with proper logger utility
  - Files: `booksApi.ts`, `BooksProvider.tsx`, `GamePage.tsx`

- [ ] **Fix hardcoded API URL in production**
  - `src/services/booksApi.ts:30` - Change to use env variable
  - Current: `'http://localhost:8081'` ❌
  - Should be: `import.meta.env.VITE_API_BASE_URL`

- [ ] **Add Error Boundaries**
  - Wrap `App` component
  - Wrap major page sections
  - Add error tracking integration

- [ ] **Add cleanup in useEffect hooks**
  - `BooksProvider.tsx` - Add abort controller
  - `GamePage.tsx` - Add isMounted check

- [ ] **Fix or hide Save button**
  - Currently only logs to console
  - Either implement or disable until ready

## 🟡 Medium Priority

- [ ] **Add `useCallback` to `loadBooks` in BooksProvider**
- [ ] **Extract duplicate health status logic to selector**
- [ ] **Add request cancellation with AbortController**
- [ ] **Add input validation (consider Zod)**
- [ ] **Improve accessibility (aria-labels, roles)**
- [ ] **Create environment variable config**

## 🟢 Low Priority (Nice to Have)

- [ ] **Add unit tests** (reducers, selectors)
- [ ] **Add component tests** (React Testing Library)
- [ ] **Add loading skeletons** (better UX)
- [ ] **Extract custom hooks** (useGame, etc.)
- [ ] **Add performance monitoring**
- [ ] **Improve JSDoc documentation**

## 📝 Code Quality Improvements

### Create These Files:

1. **`src/utils/logger.ts`** - Centralized logging
2. **`src/components/common/ErrorBoundary.tsx`** - Error boundary component
3. **`src/config/env.ts`** - Environment configuration
4. **`src/domain/game/gameConstants.ts`** - Magic number constants
5. **`src/services/apiClient.ts`** - Abstracted API client

### Update These Files:

1. **`src/services/booksApi.ts`**
   - Remove console.log
   - Use env variable for API URL
   - Add request cancellation

2. **`src/contexts/BooksProvider.tsx`**
   - Use useCallback for loadBooks
   - Add cleanup in useEffect
   - Use logger instead of console.error

3. **`src/pages/GamePage.tsx`**
   - Add cleanup in useEffect
   - Remove console.log/error
   - Fix or hide save button

4. **`src/components/game/GameHeader.tsx`**
   - Use health status selector instead of local calculation

## 🎯 Estimated Time

- **Critical fixes:** 2-3 hours
- **Medium priority:** 4-6 hours
- **Low priority:** 8-12 hours

**Total:** ~14-21 hours for complete refactoring
