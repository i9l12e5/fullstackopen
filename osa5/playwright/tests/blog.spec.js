const { test, expect, beforeEach, describe } = require("@playwright/test");
const data = {
	name: "Matti Luukkainen",
	username: "mluukkai",
	password: "salainen",
};

const blog = {
	title: "Testi",
	author: "Testaaja",
	url: "http://google.com",
};

const loginFn = async (page) => {
	await page.fill("#username-input", data.username);
	await page.fill("#password-input", data.password);
	await page.waitForSelector("#login-button", { state: "visible" });

	await page.locator("#login-button").click({ force: true });
};

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/user/register", { data });

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		await expect(page.getByText("Username:")).toBeVisible();
		await expect(page.getByText("Password:")).toBeVisible();
	});

	test("Test invalid login", async ({ page }) => {
		await page.fill("#username-input", data.username);
		await page.fill("#password-input", data.password + 1);
		await page.waitForSelector("#login-button", { state: "visible" });

		await page.locator("#login-button").click({ force: true });

		await expect(page.getByText("invalid username or password")).toBeVisible({
			timeout: 10000, // incase db takes longer to receive and respond
		});

		await page.screenshot({
			path: "tests/screenshots/login-test-screenshot-invalid.png",
		});
	});

	test("Test successful login", async ({ page }) => {
		await loginFn(page);

		await expect(page.getByText(`${data.name} logged in`)).toBeVisible({
			timeout: 10000, // incase db takes longer to receive and respond
		});

		await page.screenshot({
			path: "tests/screenshots/login-test-screenshot.png",
		});
	});
});

describe("When logged in", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/user/register", { data });

		await page.goto("/");
		await loginFn(page);
	});

	test("a new blog can be created", async ({ page }) => {
		await page.locator("#open-create-blog-button").click();

		await page.screenshot({
			path: "tests/screenshots/blog-create-before-test-screenshot.png",
		});

		await page.fill("#title-input", blog.title);
		await page.fill("#author-input", blog.author);
		await page.fill("#url-input", blog.url);

		await page.locator("#create-button").click();

		await expect(
			page.locator(
				"#status-message-div",
				`a new blog ${blog.title} by ${blog.author} added`,
			),
		).toBeVisible({ timeout: 20000 });

		await page.screenshot({
			path: "tests/screenshots/blog-create-after-test-screenshot.png",
		});
	});

	test("blog can be liked", async ({ page }) => {
		await page.locator("#open-create-blog-button").click({ timeout: 10000 });
		await page.fill("#title-input", blog.title);
		await page.fill("#author-input", blog.author);
		await page.fill("#url-input", blog.url);
		await page.locator("#create-button").click({ timeout: 10000 });

		await expect(page.locator("#blog-view-button").first()).toBeVisible({
			timeout: 20000,
		});
		await page.locator("#blog-view-button").first().click();

		await page.screenshot({
			path: "tests/screenshots/blog-like-before-test-screenshot.png",
		});

		await expect(page.locator("#blog-like-button")).toBeVisible();
		await page.locator("#blog-like-button").click({ timeout: 10000 });

		await page.screenshot({
			path: "tests/screenshots/blog-like-after-test-screenshot.png",
		});

		expect(page.locator("#blog-likes-div").textContent("likes 1"));
	});
});
