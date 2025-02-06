const { test, after, describe, before, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const {
	initialBlogs,
	newBlog,
	invalidBlog,
	addSuperUser,
	blogsInDb,
	superUserLogin,
} = require("../utils/for_testing");

const api = supertest(app);

describe("Test blog CRUD", () => {
	beforeEach(async () => {
		// Delete all users from db
		await User.deleteMany({});

		// Initialize superuser
		await addSuperUser();

		// Clear all blogs from test database
		await Blog.deleteMany({});

		// Initialize blogs
		await Blog.insertMany(initialBlogs);
	});

	test("There should be 4 blogs on db", async () => {
		const getBlogs = await api.get("/api/blogs/").expect(200);

		assert.strictEqual(getBlogs.body.length, initialBlogs.length);
	});

	test("blogs are returned as JSON", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("Add and remove blog", async () => {
		const loggedIn = await api.post("/login").send(superUserLogin).expect(200);

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${loggedIn.body.token}`)
			.send(newBlog)
			.expect(201);

		const midCheck = await blogsInDb();
		const authors = midCheck.map((find) => find.author);
		assert(authors.includes("Blogger F"));

		const getOne = midCheck.find((blog) => blog.author === newBlog.author); // Cheap solution to get the one blog with user info we just added

		await api
			.delete(`/api/blogs/${getOne.id}`)
			.set("Authorization", `Bearer ${loggedIn.body.token}`)
			.expect(200);

		const endBlogs = await blogsInDb();

		assert.strictEqual(midCheck.length, initialBlogs.length + 1);
		assert.strictEqual(endBlogs.length, initialBlogs.length);
	});

	test("Test update route", async () => {
		const newValue = 129412;
		const getBlogs = await api.get("/api/blogs").expect(200);

		await api
			.put(`/api/blogs/update/${getBlogs.body[0].id}`)
			.send({ likes: newValue })
			.expect(200);

		const updatedBlogs = await api.get("/api/blogs").expect(200);

		assert(updatedBlogs.body[0].likes === newValue);
	});

	test("Check that invalid blog posts are rejected with error 400", async () => {
		const loginUser = await api.post("/login").send(superUserLogin);

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${loginUser.body.token}`)
			.send(invalidBlog)
			.expect(400);
	});

	test("Check that id variable exists", async () => {
		const blogs = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		blogs.body.map((entry) => assert.ok(Object.hasOwn(entry, "id")));
	});

	test("Check that likes value exists", async () => {
		// Fetch all blogs from database
		const blogs = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		// Check that all blogs have likes value
		await blogs.body.map((entry) => {
			return assert.ok(Number.isFinite(entry.likes));
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
