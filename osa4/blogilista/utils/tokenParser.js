const tokenParser = (request, response, next) => {
	const authorization = request.get("authorization");
	if (authorization?.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "");
	} else {
		request.token = null;
	}

	next();
};

module.exports = tokenParser;
