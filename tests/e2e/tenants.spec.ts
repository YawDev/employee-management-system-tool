import { expect, test } from "@playwright/test";

// TODO: re-enable once Playwright logs in (auth setup + test sys-admin account).
// Every console page now redirects to /login without a session.
test.skip("navigates from the overview to the tenants table", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Tenants" }).click();

  await expect(page).toHaveURL("/tenants");
  await expect(page.getByRole("heading", { name: "Tenants" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Acme Corp/ })).toBeVisible();
});
