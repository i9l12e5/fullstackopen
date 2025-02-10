const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const userParser = require("../utils/userParser");

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
blogRouter.post("/", userParser, async (request, response) => {
	const body = request.body;
	const user = request.user;

	try {
		if (!Number.isFinite(body.likes)) {
			// Check that likes has valid value
			body.likes = 0;
		}

		if (!body.title || !body.url) {
			// Check for missing title and URL
			return response.status(400).end();
		}

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user._id, // Add user as submitter for new post
		});

		const save = await blog.save();

		// Add blog ID to user blogs

		user.blogs = user.blogs.concat(blog._id);

		await user.save();

		response.status(201).json(save);
	} catch (error) {
		if (error.name === "ValidationError") {
			return response.status(400).end();
		}

		// Prevents server crash
		if (error.name === "JsonWebTokenError") {
			return response.status(401).json({ error: "invalid token" });
		}
	}
});

// Route to delete single blog
blogRouter.delete("/:id", userParser, async (request, response) => {
	const blogId = request.params.id;
	const token = request.user;

	// Reject if token not found
	if (!token)
		return response
			.status(403)
			.json("Only logged in users can delete posts!")
			.end();

	try {
		// Find the requested blog
		const getBlog = await Blog.findById({ _id: blogId });

		// Catch null response, because it won't trigger anything past this point
		if (getBlog === null)
			return response
				.status(404)
				.json({ error: "No blog found by provided ID" });

		// Check that user is poster of requested blog
		if (getBlog.user.toString() !== token.id) {
			return response.status(403).json({
				error: "Only original poster is allowed to delete this blog post!",
			});
		}

		// Proceed with delete process
		await Blog.findOneAndDelete({ _id: blogId });
		return response.status(200).json(`Blog ID ${blogId} deleted successfully!`);
	} catch (error) {
		// General error message
		return response
			.status(400)
			.json({ error: `Something went wrong! (${error.message})` })
			.end();
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
		/* console.log(error); */
		return response.status(400).end();
	}
});

module.exports = blogRouter;
