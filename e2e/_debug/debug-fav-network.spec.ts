import { test, expect } from "@playwright/test";

test("debug: network on favorite click (after login)", async ({
  page,
  context,
}) => {
  const email = process.env.E2E_EMAIL!;
  const password = process.env.E2E_PASSWORD!;
  test.skip(!email || !password, "E2E_EMAIL / E2E_PASSWORD are not set");

  await context.clearCookies();
  await page.addInitScript(() => localStorage.clear());

  page.on("request", (req) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method())) {
      console.log("REQ:", req.method(), req.url());
    }
  });

  page.on("response", (res) => {
    const m = res.request().method();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(m)) {
      console.log("RES:", res.status(), m, res.url());
    }
  });

  await page.goto("/");

  const favBtn = page
    .getByRole("button", { name: /add to favorites/i })
    .first();
  await favBtn.click();

  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeHidden({
    timeout: 8000,
  });

  await favBtn.click();
  await page.waitForTimeout(1000);
});
