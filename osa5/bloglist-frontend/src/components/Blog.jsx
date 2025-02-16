import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, user, handleLikeAdd, handleRemove }) => {
	const [inView, setInView] = useState(false);

	const clickRemove = () => {
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
			handleRemove(blog.id);
	};

	return (
		<div style={{ border: "solid black 1px", padding: "3px" }}>
			{blog.title} {blog.author}{" "}
			<button
				id="blog-view-button"
				type="button"
				onClick={() => setInView(!inView)}
			>
				view
			</button>
			{inView ? (
				<div>
					<div>{blog.url}</div>
					<div id="blog-likes-div">
						likes {blog.likes}{" "}
						<button
							id="blog-like-button"
							type="button"
							onClick={() => handleLikeAdd(blog)}
						>
							like
						</button>
					</div>
					<div>{blog.user.username}</div>

					{blog.user.id === user.id ? (
						<button type="button" onClick={clickRemove}>
							remove
						</button>
					) : null}
				</div>
			) : null}
		</div>
	);
};

Blog.propTypes = {
	handleLikeAdd: PropTypes.func.isRequired,
	handleRemove: PropTypes.func.isRequired,
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
	blog: PropTypes.shape({
		title: PropTypes.string,
		author: PropTypes.string,
		id: PropTypes.string,
		url: PropTypes.string,
		likes: PropTypes.number,
		user: PropTypes.shape({
			username: PropTypes.string,
			id: PropTypes.string,
		}),
	}),
};

export default Blog;
