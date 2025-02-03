export const tokenParser = (request, response, next) => {
	console.log("1");
	const authorization = request.get("authorization");
	if (authorization?.startsWith("Bearer ")) {
		console.log("2");
		request.token = authorization.replace("Bearer ", "");
	} else {
		console.log("3");
		request.token = null;
	}

	console.log("4");
	next();
};
