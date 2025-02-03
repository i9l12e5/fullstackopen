const jwt = require("jsonwebtoken");

const userParser = (request, response, next) => {
	try {
		// Find user with token
		const decodedToken = jwt.verify(request.token, process.env.SECRET);

		// Return user
		request.user = decodedToken;
	} catch (error) {
		// If decodedToken fails to verify user
		return response.status(401).json({ error: "Token invalid!" });
	}

	next();
};

module.exports = userParser;
