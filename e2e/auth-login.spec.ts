import { test, expect } from "@playwright/test";

test("login: after sign in, favorites action no longer opens login modal", async ({
  page,
}) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  test.skip(!email || !password, "E2E credentials are not set");

  await page.goto("/");

  // 1) Try to add to favorites - should prompt for login
  await page.getByRole("button", { name: /Add to favorites/i }).click();
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();

  // 2) Enter credentials and click Sign In (in form)
  await page.getByPlaceholder(/email/i).fill(email!);
  await page.getByPlaceholder(/password/i).fill(password!);
  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();

  // 3) Success check: try "Add to favorites" again
  //    If login succeeds, login modal should not appear anymore
  await expect(page.locator(".overlay-class")).toBeHidden(); // Adjust selector as needed
  await page.getByRole("button", { name: /Add to favorites/i }).click();

  // Wait a bit for UI to respond
  await expect(page.getByPlaceholder(/email/i)).toBeHidden({ timeout: 3000 });
});
