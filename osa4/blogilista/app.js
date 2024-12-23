const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");

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

app.use("/api/blogs", blogRouter);

module.exports = app;
