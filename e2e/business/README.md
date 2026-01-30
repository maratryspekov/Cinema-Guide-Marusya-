# Business E2E Tests

These are **production-ready, portfolio-quality** E2E tests that validate core business scenarios.

## 📋 Tests

### 1. **Browse to Details** (`search-to-details.spec.ts`)

```
User can browse genres, find movie, and view complete details
```

- **Business Value**: User discovers movie through genres → reaches details page (core discovery flow)
- **What It Tests**:
  - Navigate to Genres page
  - Click first genre card
  - Click first movie in genre
  - Movie details fully loaded (title, rating, description, metadata)
- **Portfolio Highlight**: Demonstrates understanding of user journey testing + multi-step workflows

### 2. **Favorites Auth Gate** (`favorites-auth-gate.spec.ts`)

```
Unauthorized user is prompted to login for favorites, then can save
```

- **Business Value**: Protects premium feature + converts users to login
- **What It Tests**:
  - Unauthorized click favorite → login modal appears
  - User fills credentials
  - Login API succeeds
  - Modal closes
  - `aria-pressed` state toggles (UI + state sync)
- **Portfolio Highlight**: Shows testing UI behavior + API responses + state management

### 3. **Favorites Persistence** (`favorites-persistence.spec.ts`)

```
Favorite remains saved after page refresh
```

- **Business Value**: User data is not lost (core requirement)
- **What It Tests**:
  - Login (setup)
  - Add to favorites
  - Page reload
  - `aria-pressed` still true after refresh
  - Second refresh triple-check
- **Portfolio Highlight**: Validates backend persistence + session continuity

---

## 🚀 Run Business Tests

```bash
# Run all business tests
npm run test:e2e:business

# UI mode (interactive debugging)
npm run test:e2e:business:ui

# Headed mode (see browser)
npm run test:e2e:business:headed

# Single test
npx playwright test e2e/business/search-to-details.spec.ts
```

---

## ✨ Why These Tests Rock in Interviews

1. **They test real user journeys** - Not isolated components, but end-to-end flows
2. **Stable selectors** - Use `data-testid` + roles, not brittle CSS selectors
3. **Network awareness** - `waitForResponse()` on API calls, not just `waitForTimeout()`
4. **State normalization** - Don't depend on previous test state
5. **Clear business value** - Each test explains WHY it matters (not just WHAT it tests)

---

## 🔧 Key Patterns Used

### Stability

```typescript
// ❌ Brittle
await page.waitForTimeout(1000);

// ✅ Stable
await page.waitForResponse(
  (res) => res.url().includes("/favorites") && res.status() === 200,
  { timeout: 10000 },
);
```

### Selectors

```typescript
// ✅ Best: data-testid
const favoriteButton = page.getByTestId("favorite-toggle");

// ✅ Good: role-based
const signInButton = page.getByRole("button", { name: /sign in/i });

// ❌ Avoid: brittle CSS
const button = page.locator(".form-group .btn-blue");
```

### State Normalization

```typescript
// Always normalize before testing a toggle
let pressed = await toggle.getAttribute("aria-pressed");
if (pressed === "true") {
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
}
// Now test the "ON" state
```

---

## 📊 Coverage

| Scenario               | Test                  | Business Impact             |
| ---------------------- | --------------------- | --------------------------- |
| Discovery              | browse-to-details     | Users find content          |
| Auth + Premium Feature | favorites-auth-gate   | Conversion + Access control |
| Data Persistence       | favorites-persistence | User trust + Retention      |

---

## 💡 Next Steps

- Run tests daily in CI/CD
- Monitor failures in GitHub Actions
- Use HTML reports to debug (`npm run test:e2e:report`)
- Add more business flows as product grows
