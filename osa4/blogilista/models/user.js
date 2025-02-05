const { default: mongoose } = require("mongoose");
const { MONGODB_URI } = require("../utils/config");

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		console.log("User: connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },
	name: { type: String, required: true },
	blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		// biome-ignore lint/performance/noDelete: Setting a return variable to undefined still includes it in the response body, while delete does not
		delete returnedObject._id;
		// biome-ignore lint/performance/noDelete: Setting a return variable to undefined still includes it in the response body, while delete does not
		delete returnedObject.__v;
		// biome-ignore lint/performance/noDelete: Setting a return variable to undefined still includes it in the response body, while delete does not
		delete returnedObject.passwordHash;
	},
});

module.exports = mongoose.model("User", userSchema);
