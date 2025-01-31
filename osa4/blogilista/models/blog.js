const { default: mongoose } = require("mongoose");
const { MONGODB_URI } = require("../utils/config");

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const blogSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: String,
	url: { type: String, required: true },
	likes: Number,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

blogSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		returnedObject._id = undefined;
		returnedObject.__v = undefined;
	},
});

module.exports = mongoose.model("Blog", blogSchema);
