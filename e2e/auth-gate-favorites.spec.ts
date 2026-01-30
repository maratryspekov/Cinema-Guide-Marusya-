import { test, expect } from "@playwright/test";

test('unauthorized: clicking "Add to favorites" opens login modal', async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Add to favorites/i }).click();

  // Check modal through fields - they are more unique
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  await expect(page.getByPlaceholder(/password/i)).toBeVisible();

  // Check submit button in form (not header button)
  await expect(
    page.getByRole("main").getByRole("button", { name: "Sign In" }),
  ).toBeVisible();

  await expect(page.getByText(/register/i)).toBeVisible();
});
