const jwt = require("jsonwebtoken");
const user = require("../models/user");

const userParser = async (request, response, next) => {
	try {
		// Find user with token
		const decodedToken = jwt.verify(request.token, process.env.SECRET);
		const getUser = await user.findById(decodedToken.id);

		// Return user
		request.user = getUser;
	} catch (error) {
		// If decodedToken fails to verify user
		return response.status(401).json({ error: "Token invalid!" });
	}

	next();
};

module.exports = userParser;
