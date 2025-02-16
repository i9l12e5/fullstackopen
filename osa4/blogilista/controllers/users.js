const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/register", async (request, response) => {
	try {
		const { username, name, password } = request.body;

		if (request.body.length < 1)
			return response.status(400).end("Received empty body!");

		if (username.length < 3 || password.length < 3)
			return response.status(400).end("Password or username too short!");

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			username,
			name,
			passwordHash,
			blogs: [],
		});

		const savedUser = await newUser.save();

		response.status(201).json(savedUser);
	} catch (error) {
		if (error.code === 11000)
			return response.status(400).end("Username already taken!");

		response.status(500).json({ error: "Internal server error" });
	}
});

usersRouter.get("/", async (request, response) => {
	try {
		const getAll = await User.find({}).populate("blogs", {
			url: 1,
			title: 1,
			author: 1,
			id: 1,
		});
		response.status(200).json(getAll);
	} catch (error) {
		response.status(400).json({ error: error.message });
	}
});

module.exports = usersRouter;
