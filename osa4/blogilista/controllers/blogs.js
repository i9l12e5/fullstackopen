const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization?.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

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
	const token = getTokenFrom(request);

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({ error: "token invalid" });
		}

		console.log("--> ", decodedToken);
		console.log(body);

		const user = await User.findById(decodedToken.id);
		console.log("...", user);

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
		console.log("1: ", user);
		user.blogs = user.blogs.concat(blog._id);
		console.log("2: ", user);
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
