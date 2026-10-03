import { expect, test } from "@playwright/test";

test("navigates from the overview to the tenants table", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Tenants" }).click();

  await expect(page).toHaveURL("/tenants");
  await expect(page.getByRole("heading", { name: "Tenants" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Acme Corp/ })).toBeVisible();
});
