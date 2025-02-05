const _ = require("lodash");

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((total, value) => total + value.likes, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return null;

	const result = blogs.reduce((a, b) => {
		return b.likes > a.likes ? b : a;
	});

	// Returns everything
	return result;
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null;
	const count = _.countBy(blogs, "author");

	const mostAuthored = _.maxBy(
		Object.entries(count),
		([author, count]) => count,
	);
	/* console.log(mostAuthored); */

	return {
		author: mostAuthored[0],
		blogs: mostAuthored[1],
	};
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return null;
	// Group blogs by author
	const count = _.groupBy(blogs, "author");
	/* console.log(count); */

	// Map every author and sum all likes of their blogs
	const mostLiked = _.map(count, (blogs, author) => ({
		author,
		likes: _.sumBy(blogs, "likes"),
	}));
	/* console.log(mostLiked); */

	// Get author by highest amount of blog likes
	const getAuthor = _.maxBy(mostLiked, "likes");
	/* console.log(getAuthor); */

	return getAuthor;
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
