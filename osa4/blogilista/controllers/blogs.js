const blogRouter = require("express").Router();
const Blog = require("../models/blog");

// Get all blog entries
blogRouter.get("/", (request, response) => {
	Blog.find({}).then((blogs) => {
		response.json(blogs);
	});
});

// Post new blog entry
blogRouter.post("/", (request, response) => {
	const blog = new Blog(request.body);

	blog.save().then((result) => {
		response.status(201).json(result);
	});
});

module.exports = blogRouter;
