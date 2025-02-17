import PropTypes from "prop-types";
import { useState } from "react";

export const Create = ({ handleSave }) => {
	const [title, setTitle] = useState(null);
	const [author, setAuthor] = useState(null);
	const [url, setUrl] = useState(null);
	const [isHidden, setIsHidden] = useState(true);

	const clearForm = () => {
		setTitle(null);
		setAuthor(null);
		setUrl(null);
		setIsHidden(true);
	};

	const addNote = (event) => {
		event.preventDefault();

		handleSave({ title, author, url });
		clearForm();
	};

	const toggleView = () => setIsHidden(!isHidden);

	return isHidden ? (
		<button
			data-testid="open-create-blog-button"
			type="button"
			onClick={toggleView}
		>
			new blog
		</button>
	) : (
		<div>
			<h2>create new</h2>

			<div>
				title:{" "}
				<input
					data-testid="title-input"
					onChange={(text) => setTitle(text.target.value)}
				/>
			</div>

			<div>
				author:{" "}
				<input
					data-testid="author-input"
					onChange={(text) => setAuthor(text.target.value)}
				/>
			</div>

			<div>
				url:{" "}
				<input
					data-testid="url-input"
					onChange={(text) => setUrl(text.target.value)}
				/>
			</div>
			<div>
				<button data-testid="create-button" type="button" onClick={addNote}>
					create
				</button>
			</div>

			<div>
				<button data-testid="cancel-button" type="button" onClick={toggleView}>
					cancel
				</button>
			</div>
		</div>
	);
};

Create.propTypes = {
	handleSave: PropTypes.func.isRequired,
};
