const { test, expect, beforeEach, describe } = require("@playwright/test");
const data = {
	name: "Matti Luukkainen",
	username: "mluukkai",
	password: "salainen",
};

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users/register", {
			data,
		});

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByText("Username:")).toBeVisible();
		await expect(page.getByText("Password:")).toBeVisible();
	});

	test("Test invalid login", async ({ page }) => {
		await page.goto("/");
		await page.fill("#username-input", data.username);
		await page.fill("#password-input", data.password + 1);
		await page.waitForSelector("#login-button", { state: "visible" });

		await page.locator("#login-button").click({ force: true });

		/* const isVisible = await page.isVisible("#login-button");
		const isEnabled = await page.isEnabled("#login-button");
		console.log(`Login button is visible: ${isVisible}, enabled: ${isEnabled}`); */

		await expect(page.getByText("invalid username or password")).toBeVisible({
			timeout: 10000, // incase db takes longer to receive and respond
		});

		await page.screenshot({
			path: "tests/screenshots/login-test-screenshot-invalid.png",
		});
	});

	test("Test successful login", async ({ page }) => {
		await page.goto("/");
		await page.fill("#username-input", data.username);
		await page.fill("#password-input", data.password);
		await page.waitForSelector("#login-button", { state: "visible" });

		const isVisible = await page.isVisible("#login-button");
		const isEnabled = await page.isEnabled("#login-button");
		console.log(`Login button is visible: ${isVisible}, enabled: ${isEnabled}`);

		await page.locator("#login-button").click({ force: true });

		await expect(page.getByText(`${data.name} logged in`)).toBeVisible({
			timeout: 10000, // incase db takes longer to receive and respond
		});

		await page.screenshot({
			path: "tests/screenshots/login-test-screenshot.png",
		});
	});
});
