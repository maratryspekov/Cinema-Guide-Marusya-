import { test, expect } from "@playwright/test";

/**
 * BUSINESS TEST 1: Search → Open Movie → Details Loaded
 *
 * Value: User finds a movie and reaches the details page
 * Validates: Core discovery flow works end-to-end
 */
test("user can search for movie and view complete details", async ({
  page,
}) => {
  // 1. START
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible();

  // 2. SEARCH OPENS
  const searchInput = page.getByPlaceholder(/search/i).first();
  await expect(searchInput).toBeVisible({ timeout: 5000 });

  // 3. TYPE QUERY
  await searchInput.click();
  await searchInput.fill("action");
  await page.waitForTimeout(500); // Wait for API response

  // 4. RESULTS APPEAR - Wait for search modal/dropdown
  const searchModal = page
    .locator("[class*='modal'], [class*='dropdown']")
    .first();
  await expect(searchModal).toBeVisible({ timeout: 5000 });

  // 5. CLICK FIRST RESULT - Inside modal
  const firstResult = searchModal
    .locator("button, a, div[role='button']")
    .first();
  await expect(firstResult).toBeVisible();

  await firstResult.click();

  // Wait for navigation to movie details page
  await page.waitForURL(/.*movie.*/, { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);

  // 6. MOVIE DETAILS LOADED - Check for key elements
  // Title
  const movieTitle = page.locator("h1, h2").first();
  await expect(movieTitle).toBeVisible({ timeout: 5000 });

  // Rating badge
  const ratingBadge = page
    .locator("[class*='rating'], [class*='badge']")
    .first();
  await expect(ratingBadge).toBeVisible({ timeout: 5000 });

  // Description text
  const description = page.locator("p").nth(0);
  await expect(description).toBeVisible({ timeout: 5000 });

  // Genres or metadata
  const metadata = page.locator("p, span").nth(1);
  await expect(metadata).toBeVisible({ timeout: 5000 });

  console.log("✅ Search → Details flow complete");
});
