import { test, expect } from "@playwright/test";

test("debug: favorites button class change", async ({ page }) => {
  await page.goto("/");

  const btn = page.getByRole("button", { name: /add to favorites/i }).first();

  await expect(btn).toBeVisible();

  const beforeClass = await btn.getAttribute("class");
  console.log("BEFORE class:", beforeClass);

  await btn.click();
  await page.waitForTimeout(500);

  const afterClass = await btn.getAttribute("class");
  console.log("AFTER class:", afterClass);
});
