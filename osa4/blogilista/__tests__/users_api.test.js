const { test, after, beforeEach, describe } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const {
	initialUsers,
	invalidUsers,
	usersInDb,
} = require("../utils/for_testing");
const assert = require("node:assert");

const api = supertest(app);

describe("Test users CRUD", () => {
	beforeEach(async () => {
		// Clear all users from test database
		await User.deleteMany({});
		console.log("Reset users database");

		// Create and save four new users to test database
		const userObjects = initialUsers.map((user) => {
			return api.post("/user/register").send(user).expect(201);
		});

		await Promise.all(userObjects);
	});

	test("users are returned as JSON", async () => {
		await api
			.get("/user/")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test(`Test that user amount in db is ${initialUsers.length}`, async () => {
		const fetchCurrentUsers = await usersInDb();

		assert.strictEqual(fetchCurrentUsers.length, initialUsers.length);
	});

	test("Test invalid user registration", async () => {
		const startUsers = await usersInDb();

		const users = await api
			.post("/user/register")
			.send(invalidUsers[0])
			.expect(400);

		const endUsers = await usersInDb();

		assert(users.error.text.includes("Password or username too short!"));

		// Check that invalid user didn't get registered
		assert.strictEqual(startUsers.length, endUsers.length);
	});

	test("Test that duplicate usernames are prevented", async () => {
		const startUsers = await usersInDb();

		const users = await api
			.post("/user/register")
			.send(initialUsers[0])
			.expect(400);

		const endUsers = await usersInDb();

		assert(users.error.text.includes("Username already taken!"));

		// Check that duplicate user didn't get registered
		assert.strictEqual(startUsers.length, endUsers.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
