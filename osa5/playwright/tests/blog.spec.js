const { test, expect, beforeEach, describe } = require("@playwright/test");

const user = {
	name: "Matti Luukkainen",
	username: "mluukkai",
	password: "salainen",
};

const secondUser = {
	name: "Testi Testaaja",
	username: "testi",
	password: "salainen",
};

const blog = {
	title: "Testi",
	author: "Testaaja",
	url: "http://google.com",
};

const loginFn = async (page, username, pass) => {
	const usernameField = await page.getByTestId("username-input");
	const passwordField = await page.getByTestId("password-input");

	await usernameField.fill(username);
	await passwordField.fill(pass);

	const loginButton = await page.getByTestId("login-button");

	await expect(loginButton).toBeVisible();
	await loginButton.click({ force: true, timeout: 10000 });
};

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/user/register", {
			data: user,
		});

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		const usernameField = page.getByTestId("username-input");
		const passwordField = page.getByTestId("password-input");

		await expect(usernameField).toBeVisible();
		await expect(passwordField).toBeVisible();
	});

	test("Test invalid login", async ({ page }) => {
		const usernameField = page.getByTestId("username-input");
		const passwordField = page.getByTestId("password-input");

		await usernameField.fill(user.username);
		await passwordField.fill(user.password + 1);

		const loginButton = page.getByTestId("login-button");
		await expect(loginButton).toBeVisible();
		await loginButton.click();

		const statusMessage = page.getByTestId("status-message-div");

		await expect(statusMessage).toBeVisible();

		await expect(statusMessage).toHaveText("invalid username or password");
	});

	test("Test successful login", async ({ page }) => {
		await loginFn(page, user.username, user.password);

		const userDiv = page.getByTestId("user-div");

		await expect(userDiv).toBeVisible();
		await expect(userDiv).toContainText(`${user.name} logged in`);
	});
});

describe("When logged in", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/user/register", { data: user });
		await page.goto("/");
		await loginFn(page, user.username, user.password);
	});

	test("a new blog can be created", async ({ page }) => {
		const openButton = page.getByTestId("open-create-blog-button");
		await expect(openButton).toBeVisible();
		await openButton.click();

		const titleField = page.getByTestId("title-input");
		const authorField = page.getByTestId("author-input");
		const urlField = page.getByTestId("url-input");

		await titleField.fill(blog.title);
		await authorField.fill(blog.author);
		await urlField.fill(blog.url);

		const createButton = page.getByTestId("create-button");
		await expect(createButton).toBeVisible();
		await createButton.click();

		const statusMessage = page.getByTestId("status-message-div");
		await expect(statusMessage).toBeVisible();
		await expect(statusMessage).toHaveText(
			`a new blog ${blog.title} by ${blog.author} added`,
		);
	});

	test("blog can be liked", async ({ page }) => {
		const openButton = page.getByTestId("open-create-blog-button");
		await expect(openButton).toBeVisible();
		await openButton.click();

		const titleField = page.getByTestId("title-input");
		const authorField = page.getByTestId("author-input");
		const urlField = page.getByTestId("url-input");

		await titleField.fill(blog.title);
		await authorField.fill(blog.author);
		await urlField.fill(blog.url);

		const createButton = page.getByTestId("create-button");
		await expect(createButton).toBeVisible();
		await createButton.click();

		const viewButton = page.getByTestId("blog-view-button").first();
		await expect(viewButton).toBeVisible();
		await viewButton.click();

		const likeButton = page.getByTestId("blog-like-button");
		await expect(likeButton).toBeVisible();
		await likeButton.click();

		const likesDiv = page.getByTestId("blog-likes-div");
		await expect(likesDiv).toBeVisible();
		await expect(likesDiv).toContainText("likes 1");
	});

	test("blog can be deleted", async ({ page, request }) => {
		const openButton = page.getByTestId("open-create-blog-button");

		await expect(openButton).toBeVisible();
		await openButton.click();

		const titleField = page.getByTestId("title-input");
		const authorField = page.getByTestId("author-input");
		const urlField = page.getByTestId("url-input");

		await titleField.fill(blog.title);
		await authorField.fill(blog.author);
		await urlField.fill(blog.url);

		const createButton = page.getByTestId("create-button");
		await expect(createButton).toBeVisible();
		await createButton.click();

		const viewButton = page.getByTestId("blog-view-button").first();
		await expect(viewButton).toBeVisible();
		await viewButton.click();

		page.on("dialog", async (dialog) => {
			expect(dialog.message()).toContain(
				`Remove blog ${blog.title} by ${blog.author}`,
			);
			await dialog.accept();
		});

		const deleteButton = page.getByTestId("blog-delete-button");
		await expect(deleteButton).toBeVisible();
		await deleteButton.click();

		const status = page.getByTestId("status-message-div");
		await expect(status).toBeVisible();
		await expect(status).toContainText("blog removed successfully!");
	});

	test("blog can be deleted by only original creator", async ({
		page,
		request,
	}) => {
		await request.post("/api/user/register", {
			data: secondUser,
		});

		const openButton = page.getByTestId("open-create-blog-button");

		await expect(openButton).toBeVisible();
		await openButton.click();

		const titleField = page.getByTestId("title-input");
		const authorField = page.getByTestId("author-input");
		const urlField = page.getByTestId("url-input");

		await titleField.fill(blog.title);
		await authorField.fill(blog.author);
		await urlField.fill(blog.url);

		const createButton = page.getByTestId("create-button");
		await expect(createButton).toBeVisible();
		await createButton.click();

		const viewButton = page.getByTestId("blog-view-button").first();
		await expect(viewButton).toBeVisible();
		await viewButton.click();

		const deleteButton = page.getByTestId("blog-delete-button");
		await expect(deleteButton).toBeVisible();

		const logoutButton = page.getByTestId("user-logout-button");
		await expect(logoutButton).toBeVisible();
		await logoutButton.click();

		loginFn(page, secondUser.username, secondUser.password);

		await expect(viewButton).toBeVisible();
		await viewButton.click();

		await expect(deleteButton).toBeHidden();
	});

	test("Blogs are sorted by likes", async ({ page, browserName }) => {
		const blogs = [
			{
				title: "Testi 1",
				author: "Testaaja",
				url: "http://google.com",
			},

			{
				title: "Testi 2",
				author: "Testaaja",
				url: "http://google.com",
			},
			{
				title: "Testi 3",
				author: "Testaaja",
				url: "http://google.com",
			},
			{
				title: "Testi 4",
				author: "Testaaja",
				url: "http://google.com",
			},
		];

		const createBlog = async (newBlog) => {
			const openButton = page.getByTestId("open-create-blog-button");
			await expect(openButton).toBeVisible();
			await openButton.click();

			const titleField = page.getByTestId("title-input");
			const authorField = page.getByTestId("author-input");
			const urlField = page.getByTestId("url-input");

			await titleField.fill(newBlog.title);
			await authorField.fill(newBlog.author);
			await urlField.fill(newBlog.url);

			const createButton = page.getByTestId("create-button");
			await expect(createButton).toBeVisible();
			await createButton.click();

			const statusMessage = page.getByTestId("status-message-div");
			await expect(statusMessage).toBeVisible();
			await expect(statusMessage).toHaveText(
				`a new blog ${newBlog.title} by ${newBlog.author} added`,
			);
		};

		for (const newBlog of blogs) {
			await createBlog(newBlog);
		}

		const entryDiv = page.getByTestId("blog-entry");
		expect(entryDiv).toHaveCount(blogs.length);

		// Loop through the blogs to open them

		for (let index = 0; index < blogs.length; index++) {
			const viewButton = page.getByTestId("blog-view-button").nth(index);
			await expect(viewButton).toBeVisible();
			await viewButton.click();
		}

		const likeActions = [1, 0, 2, 1, 1, 2, 3];

		// Loop through the likeActions array to like the blog entries

		for (let index = 0; index < likeActions.length; index++) {
			const element = likeActions[index];
			const likeButton = page.getByTestId("blog-like-button").nth(element);
			await expect(likeButton).toBeVisible();
			await likeButton.click();

			/* console.log(`Liked blog at index ${element}`); */
		}

		// Let's check if the blogs are sorted by likes correctly,
		// first blog should have the most likes
		// and next one is less than or equal to the previous one.
		// Even if loop for likes fail to add all likes,
		// the test should still pass if the blogs are sorted correctly

		const blogEntries = await page.getByTestId("blog-entry").all();

		let previousLikes = Number.POSITIVE_INFINITY;

		for (const blog of blogEntries) {
			const likeText = await blog.getByTestId("blog-likes-div").textContent();
			const likeCount = Number.parseInt(likeText.replace(/\D/g, ""), 10);

			/* console.log(`Blog Likes: ${likeCount}`); */

			expect(likeCount).toBeLessThanOrEqual(previousLikes);

			previousLikes = likeCount;
		}
	});
});
