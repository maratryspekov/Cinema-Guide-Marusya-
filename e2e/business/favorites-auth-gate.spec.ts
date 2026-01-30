import { test, expect } from "@playwright/test";

/**
 * BUSINESS TEST 2: Auth Gate - Favorites Protected Feature
 *
 * Value: Unauthorized user tries favorite → login required → logs in → favorite works
 * Validates: Access control + conversion flow + state management
 */
test("unauthorized user is prompted to login for favorites, then can save", async ({
  page,
  context,
}) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD not set");

  // 0. SETUP - Clean session
  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());

  // 1. START - Home page
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible({ timeout: 5000 });

  // 2. FIND FAVORITE BUTTON
  const favoriteToggle = page.getByTestId("favorite-toggle");
  await expect(favoriteToggle).toBeVisible({ timeout: 5000 });

  // 3. CLICK FAVORITE (should trigger login modal)
  await favoriteToggle.click();

  // 4. LOGIN MODAL APPEARS
  const emailInput = page.getByPlaceholder(/email/i);
  const passwordInput = page.getByPlaceholder(/password/i);
  const signInButton = page
    .getByRole("main")
    .getByRole("button", { name: /sign in/i });

  await expect(emailInput).toBeVisible({ timeout: 3000 });
  await expect(passwordInput).toBeVisible({ timeout: 3000 });
  await expect(signInButton).toBeVisible({ timeout: 3000 });
  console.log("✅ Login modal appeared");

  // 5. FILL CREDENTIALS
  await emailInput.fill(email!);
  await passwordInput.fill(password!);

  // 6. SUBMIT - Wait for API response
  const loginResponse = page.waitForResponse(
    (res) => res.url().includes("/auth/login") && res.status() === 200,
    { timeout: 10000 },
  );

  await signInButton.click();
  await loginResponse;
  console.log("✅ Login API successful");

  // 7. MODAL CLOSES
  await expect(emailInput).toBeHidden({ timeout: 5000 });
  await expect(passwordInput).toBeHidden({ timeout: 5000 });
  console.log("✅ Login modal closed");

  // 8. FAVORITE STATE CHANGES - aria-pressed toggles
  // Initial state: probably false (just logged in)
  const pressed = await favoriteToggle.getAttribute("aria-pressed");
  console.log(`Initial aria-pressed: ${pressed}`);

  // If already true, toggle to false to reset
  if (pressed === "true") {
    await favoriteToggle.click();
    await expect(favoriteToggle).toHaveAttribute("aria-pressed", "false", {
      timeout: 5000,
    });
    await page.waitForTimeout(300);
  }

  // 9. CLICK FAVORITE - Should toggle to TRUE
  await favoriteToggle.click();

  // Wait for favorites API call
  await page.waitForResponse(
    (res) =>
      res.url().includes("/favorites") &&
      (res.status() === 200 || res.status() === 201),
    { timeout: 10000 },
  );

  // 10. VERIFY - aria-pressed is now TRUE
  await expect(favoriteToggle).toHaveAttribute("aria-pressed", "true", {
    timeout: 5000,
  });
  console.log("✅ Favorite toggled to TRUE");

  console.log("✅ Auth gate flow complete");
});
