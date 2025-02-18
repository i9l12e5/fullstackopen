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
			.get("/api/user/")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("Test user registeration", async () => {
		await api.post("/api/user/register").send(singleUser).expect(201);

		const fetchUsersEnd = await usersInDb();

		const match = await fetchUsersEnd.find(
			(user) => user.username === singleUser.username,
		);

		assert.strictEqual(match.username, singleUser.username);
	});

	test("Test invalid user registration", async () => {
		const add = await api
			.post("/api/user/register")
			.send(invalidUsers[0])
			.expect(400);

		assert(add.error.text.includes("Password or username too short!"));

		const users = await usersInDb();

		const find = users.find((user) => user.username === invalidUsers[0]);

		// Check that invalid user didn't get registered
		assert.strictEqual(find, undefined);
	});

	test("Test that duplicate usernames are prevented", async () => {
		const sameUser = await api
			.post("/api/user/register")
			.send(initialUsers[0])
			.expect(400);

		assert(sameUser.error.text.includes("Username already taken!"));
	});
});

after(async () => {
	await mongoose.connection.close();
});
