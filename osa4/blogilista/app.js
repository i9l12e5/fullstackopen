const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const testsRouter = require("./controllers/tests");
const tokenParser = require("./utils/tokenParser");

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connection to MongoDB:", error.message);
	});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(tokenParser);

app.use("/api/blogs", blogRouter);
app.use("/user", usersRouter);
app.use("/login", loginRouter);

if (process.env.NODE_ENV === "development") app.use("/testing", testsRouter);

module.exports = app;
