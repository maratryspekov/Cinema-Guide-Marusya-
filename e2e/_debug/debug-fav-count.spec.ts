import { test, expect } from "@playwright/test";

test("debug: how many favorite buttons exist", async ({ page }) => {
  await page.goto("/");

  // Wait for main page to load (adjust for your UI)
  await expect(page.getByRole("heading", { name: /top 10/i })).toBeVisible({
    timeout: 15000,
  });

  const btns = page.getByRole("button", { name: /add to favorites/i });
  const count = await btns.count();
  console.log("FAV BUTTONS COUNT:", count);

  for (let i = 0; i < count; i++) {
    const html = await btns
      .nth(i)
      .evaluate((el) => (el as HTMLElement).outerHTML.slice(0, 180) + "...");
    console.log(`BTN[${i}]:`, html);
  }
});
