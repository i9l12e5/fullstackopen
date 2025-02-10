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
			<button type="button" onClick={() => setInView(!inView)}>
				view
			</button>
			{inView ? (
				<div>
					<div>{blog.url}</div>
					<div>
						likes {blog.likes}{" "}
						<button type="button" onClick={() => handleLikeAdd(blog)}>
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

export default Blog;
