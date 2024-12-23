const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const { initialBlogs, newBlog, invalidBlog } = require("../utils/for_testing");

const api = supertest(app);

describe("Test blog CRUD", () => {
	beforeEach(async () => {
		// Clear all blogs from test database
		await Blog.deleteMany({});
		console.log("Reset database");

		// Create and save 4 blogs to test database
		const blogObjects = initialBlogs.map((blog) =>
			api.post("/api/blogs").send(blog).expect(201),
		);

		await Promise.all(blogObjects);
	});

	test("blogs are returned as JSON", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("Remove first blog", async () => {
		const getBlogs = await api.get("/api/blogs").expect(200);
		const getFirst = getBlogs.body[0];

		await api.delete(`/api/blogs/delete/${getFirst.id}`).expect(204);

		const response = await api.get("/api/blogs").expect(200);

		assert.strictEqual(response.body.length, initialBlogs.length - 1);
	});

	test("Add new blog", async () => {
		// Check that database has only 4 blog entrys
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		assert.strictEqual(response.body.length, initialBlogs.length);

		// Add new blog
		await api.post("/api/blogs").send(newBlog).expect(201);

		// Check that new blog was added to database
		const finalResponse = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const authors = finalResponse.body.map((find) => find.author);

		assert.strictEqual(finalResponse.body.length, initialBlogs.length + 1);
		assert(authors.includes("Blogger D"));
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
		await api.post("/api/blogs").send(invalidBlog).expect(400);
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
