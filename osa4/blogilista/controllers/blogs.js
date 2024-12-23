const blogRouter = require("express").Router();
const Blog = require("../models/blog");

// Get all blog entries
blogRouter.get("/", async (request, response) => {
	try {
		const blogs = await Blog.find({});
		response.json(blogs);
	} catch (error) {
		response.status(400).end();
	}
});

// Post new blog entry
blogRouter.post("/", async (request, response) => {
	const body = request.body;

	try {
		// Check that likes has valid value
		if (!Number.isFinite(body.likes)) {
			body.likes = 0;
		}

		if (!body.title || !body.url) {
			return response.status(400).end();
		}

		const blog = new Blog(body);
		const save = await blog.save();

		response.status(201).json(save);
	} catch (error) {
		if (error.name === "ValidationError") {
			return response.status(400).end();
		}
	}
});

// Route to delete single blog
blogRouter.delete("/delete/:id", async (request, response) => {
	const blogId = request.params.id;

	try {
		await Blog.findOneAndDelete({ _id: blogId });
		return response.status(204).end();
	} catch (error) {
		return response.status(400).end();
	}
});

// Route to update blog entry
blogRouter.put("/update/:id", async (request, response) => {
	const blogId = request.params.id;
	const body = request.body;

	try {
		await Blog.findByIdAndUpdate({ _id: blogId }, { $set: body });
		return response.status(200).end();
	} catch (error) {
		return response.status(400).end();
	}
});

module.exports = blogRouter;
