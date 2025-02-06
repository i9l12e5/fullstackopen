const { test, after, describe, beforeEach, before } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const {
	initialUsers,
	invalidUsers,
	usersInDb,
	singleUser,
} = require("../utils/for_testing");
const assert = require("node:assert");

const api = supertest(app);

describe("Test users CRUD", () => {
	beforeEach(async () => {
		// Delete all users from db
		await User.deleteMany({});

		// Initialize users
		await User.insertMany(initialUsers);
	});

	test("users are returned as JSON", async () => {
		await api
			.get("/user/")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("Test user registeration", async () => {
		await api.post("/user/register").send(singleUser).expect(201);

		const fetchUsers = await usersInDb();

		assert.strictEqual(fetchUsers.length, 1);
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

		assert(users.error.text.includes("Username already taken!"));

		const endUsers = await usersInDb();

		// Check that duplicate user didn't get registered
		assert.strictEqual(startUsers.length, endUsers.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
