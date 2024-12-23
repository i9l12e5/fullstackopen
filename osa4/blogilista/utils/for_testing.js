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

module.exports = {
	reverse,
	average,
	initialBlogs,
	newBlog,
	invalidBlog,
};
