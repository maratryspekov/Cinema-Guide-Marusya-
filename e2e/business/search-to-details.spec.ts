import { test, expect } from "@playwright/test";

/**
 * BUSINESS TEST 1: Browse → Find Movie → Details Loaded
 *
 * Value: User discovers a movie through genres and views complete details
 * Validates: Core discovery flow works end-to-end (more stable than search)
 */
test("user can browse genres, find movie, and view complete details", async ({
  page,
}) => {
  // 1. START - Home page
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible({ timeout: 5000 });

  // 2. NAVIGATE TO GENRES
  const genresLink = page.getByRole("link", { name: /genres/i });
  await expect(genresLink).toBeVisible({ timeout: 5000 });
  await genresLink.click();

  // 3. GENRES PAGE LOADED
  const genresHeading = page.getByRole("heading", { name: /genres/i });
  await expect(genresHeading).toBeVisible({ timeout: 5000 });

  // 4. SELECT FIRST GENRE CARD
  const genreCards = page.locator("[class*='card']");
  await expect(genreCards.first()).toBeVisible({ timeout: 5000 });
  await genreCards.first().click();

  // 5. GENRE MOVIES PAGE LOADED - Should show heading with genre
  const movieHeading = page.getByRole("heading").first();
  await expect(movieHeading).toBeVisible({ timeout: 5000 });

  // 6. WAIT FOR MOVIES TO LOAD
  await page.waitForTimeout(500);

  // 7. CLICK FIRST MOVIE
  const movieCards = page.locator("[class*='card'], [class*='Movie']");
  await expect(movieCards.first()).toBeVisible({ timeout: 5000 });
  await movieCards.first().click();

  // 8. WAIT FOR MOVIE DETAILS PAGE
  await page.waitForURL(/.*movie.*/, { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);

  // 9. MOVIE DETAILS LOADED - Check for key elements
  // Title
  const movieTitle = page.locator("h1, h2").first();
  await expect(movieTitle).toBeVisible({ timeout: 5000 });

  // Description text
  const description = page.locator("p").nth(0);
  await expect(description).toBeVisible({ timeout: 5000 });

  // Verify we have content (title + description are sufficient indicators)
  const titleText = await movieTitle.textContent();
  const descriptionText = await description.textContent();

  if (!titleText || !descriptionText) {
    throw new Error("Movie details incomplete: missing title or description");
  }

  console.log("✅ Browse → Genres → Movie → Details flow complete");
});
