const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// Get all blog entries
blogRouter.get("/", async (request, response) => {
	try {
		const blogs = await Blog.find({}).populate("user", {
			username: 1,
			name: 1,
			id: 1,
		});
		response.status(200).json(blogs);
	} catch (error) {
		response.status(400).end();
	}
});

// Post new blog entry
blogRouter.post("/", async (request, response) => {
	const body = request.body;
	console.log(body);

	const user = await User.find({}); // Find all and we'll use first one
	console.log(user);

	try {
		// Check that likes has valid value
		if (!Number.isFinite(body.likes)) {
			body.likes = 0;
		}

		// Check for missing title and URL
		if (!body.title || !body.url) {
			return response.status(400).end();
		}

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user[0].id, // Add user as submitter for new post
		});

		const save = await blog.save();

		// Add blog ID to user blogs
		user[0].blogs = user[0].blogs.concat(blog._id);
		await user[0].save();

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
