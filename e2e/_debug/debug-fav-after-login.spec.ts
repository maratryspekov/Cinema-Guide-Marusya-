import { test, expect } from "@playwright/test";

test("debug: favorites state after login", async ({ page, context }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD are not set");

  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());

  await page.goto("/");

  // 1) Find favorite button by testid (most stable way)
  let favBtn = page.getByTestId("favorite-toggle");
  await expect(favBtn).toBeVisible();

  // 2) Click -> login modal will open (if not authorized)
  await favBtn.click();

  // 3) Login
  const emailInput = page.getByRole("textbox", { name: "Email" });
  const passInput = page.getByRole("textbox", { name: "Password" });

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email!);
  await passInput.fill(password!);

  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();

  // Wait for modal to close (by email input disappearing)
  await expect(emailInput).toBeHidden({ timeout: 8000 });

  // (important) After login, component may have rerendered - re-get locator
  favBtn = page.getByTestId("favorite-toggle");
  await expect(favBtn).toBeVisible();

  // --- SNAPSHOT BEFORE ---
  const before = await page.evaluate(() => ({
    keys: Object.keys(localStorage),
    values: Object.fromEntries(
      Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)]),
    ),
  }));
  console.log("LOCALSTORAGE BEFORE:", before.keys);

  const btnBefore = await favBtn.evaluate((el) => ({
    ariaLabel: el.getAttribute("aria-label"),
    ariaPressed: el.getAttribute("aria-pressed"),
    className: el.getAttribute("class"),
    html: el.outerHTML.slice(0, 220) + "...",
  }));
  console.log("BTN BEFORE:", btnBefore);

  // 4) Click favorite while authorized
  // Wait for /api/favorites request so "after" is truly after the change
  await Promise.all([
    page.waitForResponse((res) => {
      const url = res.url();
      return (
        url.includes("/api/favorites") &&
        (res.status() === 200 || res.status() === 201)
      );
    }),
    favBtn.click(),
  ]);

  // --- SNAPSHOT AFTER ---
  const after = await page.evaluate(() => ({
    keys: Object.keys(localStorage),
    values: Object.fromEntries(
      Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)]),
    ),
  }));
  console.log("LOCALSTORAGE AFTER:", after.keys);

  const btnAfter = await favBtn.evaluate((el) => ({
    ariaLabel: el.getAttribute("aria-label"),
    ariaPressed: el.getAttribute("aria-pressed"),
    className: el.getAttribute("class"),
    html: el.outerHTML.slice(0, 220) + "...",
  }));
  console.log("BTN AFTER:", btnAfter);

  // smoke
  expect(true).toBe(true);
});
