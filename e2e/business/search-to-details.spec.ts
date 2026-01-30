import { test, expect } from "@playwright/test";

test("user can browse genres, find movie, and view complete details", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible({ timeout: 15000 });

  await page.getByRole("link", { name: /genres/i }).click();
  await expect(page.getByTestId("genres-page")).toBeVisible({ timeout: 20000 });

  const firstGenre = page.getByTestId("genre-item").first();
  await expect(firstGenre).toBeVisible({ timeout: 20000 });
  await firstGenre.click();

  await expect(page).toHaveURL(/\/movies\?genre=/, { timeout: 20000 });

  const firstMovie = page.getByTestId("movie-card").first();
  await expect(firstMovie).toBeVisible({ timeout: 20000 });
  await firstMovie.click();

  await expect(page).toHaveURL(/\/movie\//, { timeout: 20000 });

  await expect(page.getByTestId("movie-title")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("movie-plot")).toBeVisible({ timeout: 20000 });

  await expect(page.getByTestId("movie-title")).not.toHaveText("");
  await expect(page.getByTestId("movie-plot")).not.toHaveText("");
});
