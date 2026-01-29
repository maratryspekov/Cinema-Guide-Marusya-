import { test, expect } from "@playwright/test";

test("login: after sign in, favorites action no longer opens login modal", async ({
  page,
}) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  test.skip(!email || !password, "E2E credentials are not set");

  await page.goto("/");

  // 1) Пытаемся добавить в избранное → должно попросить логин
  await page.getByRole("button", { name: /Add to favorites/i }).click();
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();

  // 2) Вводим креды и жмём Sign In (в форме)
  await page.getByPlaceholder(/email/i).fill(email!);
  await page.getByPlaceholder(/password/i).fill(password!);
  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();

  // 3) Проверка успеха: пробуем снова "Add to favorites"
  //    Если логин успешен, модалка логина больше не должна появляться.
  await expect(page.locator(".overlay-class")).toBeHidden(); // Adjust selector as needed
  await page.getByRole("button", { name: /Add to favorites/i }).click();

  // Ждём чуть-чуть, чтобы UI успел среагировать
  await expect(page.getByPlaceholder(/email/i)).toBeHidden({ timeout: 3000 });
});
