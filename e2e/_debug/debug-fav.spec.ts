import { test, expect } from "@playwright/test";

test("debug: what changes on favorites button", async ({ page }) => {
  await page.goto("/");

  // берём ПЕРВУЮ кнопку "Add to favorites" (чтобы не ловить strict mode)
  const favBtn = page
    .getByRole("button", { name: /add to favorites|remove from favorites/i })
    .first();

  await expect(favBtn).toBeVisible();

  const beforeLabel = await favBtn.getAttribute("aria-label");
  const beforePressed = await favBtn.getAttribute("aria-pressed");
  const beforeText = await favBtn.textContent();

  console.log("BEFORE aria-label:", beforeLabel);
  console.log("BEFORE aria-pressed:", beforePressed);
  console.log("BEFORE text:", beforeText);

  await favBtn.click();

  // ждём небольшой ререндер
  await page.waitForTimeout(500);

  const afterLabel = await favBtn.getAttribute("aria-label");
  const afterPressed = await favBtn.getAttribute("aria-pressed");
  const afterText = await favBtn.textContent();

  console.log("AFTER aria-label:", afterLabel);
  console.log("AFTER aria-pressed:", afterPressed);
  console.log("AFTER text:", afterText);
});
