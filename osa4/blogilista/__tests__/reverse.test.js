const { test, describe, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const reverse = require("../utils/for_testing").reverse;

describe("reverse test", () => {
	test("reverse of a", () => {
		const result = reverse("a");

		assert.strictEqual(result, "a");
	});

	test("reverse of react", () => {
		const result = reverse("react");

		assert.strictEqual(result, "tcaer");
	});

	test("reverse of saippuakauppias", () => {
		const result = reverse("saippuakauppias");

		assert.strictEqual(result, "saippuakauppias");
	});
});

after(async () => {
	await mongoose.connection.close();
});
