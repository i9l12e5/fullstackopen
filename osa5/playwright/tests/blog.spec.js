const { test, expect, beforeEach, describe } = require("@playwright/test");
const data = {
	name: "Matti Luukkainen",
	username: "mluukkai",
	password: "salainen",
};

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("http://localhost:3003/api/testing/reset");
		await request.post("http://localhost:3003/api/users/register", {
			data,
		});

		await page.goto("http://localhost:5173");
	});

	test("Login form is shown", async ({ page }) => {
		await page.goto("http://localhost:5173");

		await expect(page.getByText("Username:")).toBeVisible();
		await expect(page.getByText("Password:")).toBeVisible();
	});

	test("Test invalid login", async ({ page }) => {
		await page.goto("http://localhost:5173");
		await page.fill("#username-input", data.username);
		await page.fill("#password-input", data.password + 1);
		await page.getByRole("button", { name: "Login" }).click();
	});

	test("Test successful login", async ({ page }) => {
		await page.goto("http://localhost:5173");
		await page.fill("#username-input", data.username);
		await page.fill("#password-input", data.password);
		await page.getByRole("button", { name: "Login" }).click();
	});
});
