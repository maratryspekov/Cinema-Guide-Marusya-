import { test, expect } from "@playwright/test";

test("debug: favorites state after login", async ({ page, context }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD are not set");

  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());

  await page.goto("/");

  // 1) Находим кнопку избранного по testid (самый стабильный способ)
  let favBtn = page.getByTestId("favorite-toggle");
  await expect(favBtn).toBeVisible();

  // 2) Жмём -> откроется логин (если не авторизован)
  await favBtn.click();

  // 3) Логин
  const emailInput = page.getByRole("textbox", { name: "Email" });
  const passInput = page.getByRole("textbox", { name: "Password" });

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email!);
  await passInput.fill(password!);

  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();

  // ждём закрытие модалки (по исчезновению email)
  await expect(emailInput).toBeHidden({ timeout: 8000 });

  // (важно) после логина компонент мог перерендериться — пере-берём локатор
  favBtn = page.getByTestId("favorite-toggle");
  await expect(favBtn).toBeVisible();

  // --- СНИМОК ДО ---
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

  // 4) Кликаем favorite уже авторизованным
  // Ждём сетевой запрос /api/favorites, чтобы "после" было реально после изменения
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

  // --- СНИМОК ПОСЛЕ ---
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
