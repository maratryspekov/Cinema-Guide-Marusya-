import { test, expect } from "@playwright/test";

/**
 * BUSINESS TEST 3: Favorites Persistence
 *
 * Value: User's favorite data survives page refresh (real requirement)
 * Validates: Backend persistence + session management + Redux/state sync
 */
test("favorite remains saved after page refresh", async ({ page, context }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD not set");

  // 0. SETUP - Clean session
  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());

  // 1. LOGIN FIRST
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible({ timeout: 5000 });

  const favoriteToggle = page.getByTestId("favorite-toggle");
  await expect(favoriteToggle).toBeVisible({ timeout: 5000 });
  await favoriteToggle.click();

  // Fill login form
  await expect(page.getByPlaceholder(/email/i)).toBeVisible({ timeout: 3000 });
  await page.getByPlaceholder(/email/i).fill(email!);
  await page.getByPlaceholder(/password/i).fill(password!);

  // Submit and wait for auth
  const loginRes = page.waitForResponse(
    (res) => res.url().includes("/auth/login") && res.status() === 200,
  );
  await page
    .getByRole("main")
    .getByRole("button", { name: /sign in/i })
    .click();
  await loginRes;

  // Wait for modal to close
  await expect(page.getByPlaceholder(/email/i)).toBeHidden({ timeout: 5000 });
  console.log("✅ Logged in");

  // 2. NORMALIZE START STATE - Ensure favorite is OFF
  let pressed = await favoriteToggle.getAttribute("aria-pressed");
  if (pressed === "true") {
    await favoriteToggle.click();
    await expect(favoriteToggle).toHaveAttribute("aria-pressed", "false", {
      timeout: 5000,
    });
    // Wait for API to sync
    await page
      .waitForResponse((res) => res.url().includes("/favorites"), {
        timeout: 10000,
      })
      .catch(() => null);
    await page.waitForTimeout(300);
  }

  console.log("✅ Favorite normalized to OFF");

  // 3. ADD TO FAVORITES
  await favoriteToggle.click();

  // Wait for API response
  const favResponse = page.waitForResponse(
    (res) =>
      res.url().includes("/favorites") &&
      (res.status() === 200 || res.status() === 201),
    { timeout: 10000 },
  );
  await favResponse;

  // Verify UI updated
  await expect(favoriteToggle).toHaveAttribute("aria-pressed", "true", {
    timeout: 5000,
  });
  console.log("✅ Favorite added (aria-pressed=true)");

  // 4. REFRESH PAGE
  await page.reload();
  await expect(page.getByRole("main")).toBeVisible({ timeout: 5000 });

  // 5. VERIFY PERSISTENCE
  const favoriteToggleAfterRefresh = page.getByTestId("favorite-toggle");
  await expect(favoriteToggleAfterRefresh).toBeVisible({ timeout: 5000 });

  // Check aria-pressed is STILL true
  const pressedAfterRefresh =
    await favoriteToggleAfterRefresh.getAttribute("aria-pressed");
  console.log(`After refresh - aria-pressed: ${pressedAfterRefresh}`);

  expect(pressedAfterRefresh).toBe("true");
  console.log("✅ Favorite persisted after refresh");

  // 6. BONUS: Second refresh to triple-check
  await page.reload();
  await expect(page.getByRole("main")).toBeVisible({ timeout: 5000 });

  const favoriteToggleFinal = page.getByTestId("favorite-toggle");
  const pressedFinal = await favoriteToggleFinal.getAttribute("aria-pressed");
  expect(pressedFinal).toBe("true");
  console.log("✅ Favorite still persisted (second refresh)");

  console.log("✅ Persistence flow complete");
});
