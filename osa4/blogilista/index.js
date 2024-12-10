const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const { PORT } = require("./utils/config");
const logger = require("./utils/logger");

const MONGO_DB = process.env.MONGODB_URI;

mongoose
	.connect(MONGO_DB)
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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
