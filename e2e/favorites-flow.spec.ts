import { test, expect } from "@playwright/test";

test("favorites: login → toggle favorite updates aria-pressed", async ({
  page,
  context,
}) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD are not set");

  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");

  // открыть логин через клик по избранному
  const fav = page.getByTestId("favorite-toggle");
  await expect(fav).toBeVisible({ timeout: 15000 });
  await fav.click();

  // логин
  await page.getByRole("textbox", { name: "Email" }).fill(email!);
  await page.getByRole("textbox", { name: "Password" }).fill(password!);

  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/api/auth/login") && res.status() === 200,
    ),
    page.getByRole("main").getByRole("button", { name: "Sign In" }).click(),
  ]);

  // ждём что модалка ушла
  await expect(page.getByRole("textbox", { name: "Email" })).toBeHidden({
    timeout: 15000,
  });

  // стабилизация UI после логина
  await expect(fav).toBeVisible({ timeout: 15000 });
  await expect(fav).toBeEnabled({ timeout: 15000 });

  const favoritesOk = (res: any) =>
    res.url().includes("/api/favorites") &&
    [200, 201, 204].includes(res.status());

  // Нормализуем старт: если уже true — выключим, чтобы начать с false
  const pressed = await fav.getAttribute("aria-pressed");
  if (pressed === "true") {
    await expect(fav).toBeEnabled({ timeout: 15000 });

    await Promise.all([page.waitForResponse(favoritesOk), fav.click()]);

    await expect(fav).toHaveAttribute("aria-pressed", "false", {
      timeout: 15000,
    });
  }

  // включаем → ждём ответ /api/favorites → ждём aria-pressed=true
  await expect(fav).toBeEnabled({ timeout: 15000 });

  await Promise.all([page.waitForResponse(favoritesOk), fav.click()]);

  await expect(fav).toHaveAttribute("aria-pressed", "true", { timeout: 15000 });

  // выключаем → ждём ответ → ждём aria-pressed=false
  await expect(fav).toBeEnabled({ timeout: 15000 });

  await Promise.all([page.waitForResponse(favoritesOk), fav.click()]);

  await expect(fav).toHaveAttribute("aria-pressed", "false", {
    timeout: 15000,
  });
});
