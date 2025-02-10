import { useState } from "react";

export const Create = ({ handleSave }) => {
	const [title, setTitle] = useState(null);
	const [author, setAuthor] = useState(null);
	const [url, setUrl] = useState(null);
	const [isHidden, setIsHidden] = useState(true);

	const toggleView = () => setIsHidden(!isHidden);

	return isHidden ? (
		<button type="button" onClick={toggleView}>
			new note
		</button>
	) : (
		<div>
			<h2>create new</h2>

			<div>
				title: <input onChange={(text) => setTitle(text.target.value)} />
			</div>

			<div>
				author: <input onChange={(text) => setAuthor(text.target.value)} />
			</div>

			<div>
				url: <input onChange={(text) => setUrl(text.target.value)} />
			</div>
			<div>
				<button
					type="button"
					onClick={() => handleSave({ title, author, url })}
				>
					create
				</button>
			</div>

			<div>
				<button type="button" onClick={toggleView}>
					cancel
				</button>
			</div>
		</div>
	);
};
