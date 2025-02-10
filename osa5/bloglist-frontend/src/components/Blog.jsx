import { useState } from "react";

const Blog = ({ blog }) => {
	const [inView, setInView] = useState(false);

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
						likes {blog.likes} <button type="button">like</button>
					</div>
					<div>{blog.user.username}</div>
				</div>
			) : null}
		</div>
	);
};

export default Blog;
