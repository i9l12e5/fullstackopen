const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");

const reverse = (string) => {
	return string.split("").reverse().join("");
};

const average = (array) => {
	const reducer = (sum, item) => {
		return sum + item;
	};

	return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const usersInDb = async () => {
	try {
		const users = await User.find({});
		return users.map((u) => u.toJSON());
	} catch (error) {
		console.error("Error fetching users from DB:", error);
		return [];
	}
};

const blogsInDb = async () => {
	try {
		const blogs = await Blog.find({});
		return blogs.map((b) => b.toJSON());
	} catch (error) {
		console.error("Error fetching users from DB:", error);
		return [];
	}
};

const initialBlogs = [
	{ title: "Blog 1", author: "Blogger A", url: "NA", likes: 0 },
	{ title: "Blog 2", author: "Blogger B", url: "NA", likes: 10 },
	{ title: "Blog 3", author: "Blogger C", url: "NA", likes: 999 },
	{ title: "Blog 4", author: "Blogger D", url: "NA", likes: 1 },
];

const newBlog = { title: "Blog 5", author: "Blogger F", url: "NA", likes: 0 };
const invalidBlog = { author: "Blogger G", likes: 10 };

const superUser = { name: "Superuser", password: "super", username: "suproo" };
const superUserLogin = { username: "suproo", password: "super" };

const addSuperUser = async () => {
	const checkFirst = await User.findOne({ username: superUser.username });

	if (checkFirst) return console.log("Superuser already created");

	const passwordHash = await bcrypt.hash(superUser.password, 10);

	const user = new User({
		username: superUser.username,
		name: superUser.name,
		passwordHash,
		blogs: [],
	});

	await user.save();
};

const initialUsers = [
	{ name: "User 1", password: "user1", username: "usr_one" },
	{ name: "User 2", password: "user2", username: "usr_two" },
	{ name: "User 3", password: "user3", username: "usr_three" },
	{ name: "User 4", password: "user4", username: "usr_four" },
];

const invalidUsers = [
	{ name: "User 5", password: "u5", username: "usr_five" },
	{ name: "User 6", password: "user6", username: "ix" },
	{ name: "User 7", password: "u7", username: "usr_seven" },
];

const singleUser = { name: "testi", password: "testi1", username: "testaaja" };

module.exports = {
	reverse,
	average,
	usersInDb,
	blogsInDb,
	initialBlogs,
	newBlog,
	superUser,
	superUserLogin,
	addSuperUser,
	invalidBlog,
	initialUsers,
	invalidUsers,
	singleUser,
};
