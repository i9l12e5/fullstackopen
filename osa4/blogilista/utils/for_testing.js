const reverse = (string) => {
	return string.split("").reverse().join("");
};

const average = (array) => {
	const reducer = (sum, item) => {
		return sum + item;
	};

	return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const initialBlogs = [
	{ title: "Blog 1", author: "Blogger A", url: "NA", likes: 0 },
	{ title: "Blog 2", author: "Blogger B", url: "NA", likes: 10 },
	{ title: "Blog 3", author: "Blogger C", url: "NA", likes: 999 },
	{ title: "Blog 4", author: "Blogger D", url: "NA", likes: "" },
];

const newBlog = { title: "Blog 5", author: "Blogger F", url: "NA", likes: 0 };
const invalidBlog = { author: "Blogger G", likes: 10 };

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
	/* { name: "user 8", password: "user8", username: "usr_eight" } */
];

module.exports = {
	reverse,
	average,
	initialBlogs,
	newBlog,
	invalidBlog,
	initialUsers,
	invalidUsers,
};
