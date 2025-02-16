const testsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

testsRouter.post("/reset", async (request, response) => {
	await Blog.deleteMany({});
	await User.deleteMany({});

	return response.status(204).json("Database cleared!").end();
});

module.exports = testsRouter;
