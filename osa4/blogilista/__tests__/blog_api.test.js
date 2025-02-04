const { test, after, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const {
	initialBlogs,
	newBlog,
	invalidBlog,
	initialUsers,
	superUser,
} = require("../utils/for_testing");
const user = require("../models/user");

const api = supertest(app);

const Login = async () => {
	const user = await api.post("/login/").send({
		username: superUser.username,
		password: superUser.password,
	});

	return user.body;
};

describe("Test blog CRUD", () => {
	before(async () => {
		// Clear all blogs from test database
		await Blog.deleteMany({});
		const checkBlogs = await api.get("/api/blogs").expect(200);

		assert.strictEqual(checkBlogs.body.length, 0);

		// Delete all users from db
		await user.deleteMany({});

		console.log("Reset database");

		// Create superuser account
		await api.post("/user/register").send(superUser).expect(201);

		const users = await user.find({});
		assert.strictEqual(users.length, 1);

		// Login as superuser
		const superuser = await Login();

		// Create and save 4 blogs to test database, map causes async problems saving ids to user blogs
		for (const blog of initialBlogs) {
			await api
				.post("/api/blogs")
				.set("Authorization", `Bearer ${superuser.token}`)
				.send(blog)
				.expect(201);
		}
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

	test("Remove first blog", async () => {
		// Login as superuser
		const superuser = await Login();

		const getBlogs = await api.get("/api/blogs").expect(200);
		const getFirst = getBlogs.body[0];

		await api
			.delete(`/api/blogs/${getFirst.id}`)
			.set("Authorization", `Bearer ${superuser.token}`)
			.expect(200);

		const response = await api.get("/api/blogs").expect(200);

		assert.strictEqual(response.body.length, initialBlogs.length - 1);
	});

	test("Add new blog", async () => {
		// Login as superuser
		const superuser = await Login();

		// Check that database has only 4 blog entrys
		const start = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		// Add new blog
		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${superuser.token}`)
			.send(newBlog)
			.expect(201);

		// Check that new blog was added to database
		const end = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		assert.strictEqual(start.body.length, initialBlogs.length - 1); // Start should be 3 after last test removed 1
		assert.strictEqual(end.body.length, start.body.length + 1); // End should be 4 after adding 1

		const authors = end.body.map((find) => find.author);
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
		// Login as superuser
		const superuser = await Login();

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${superuser.token}`)
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
