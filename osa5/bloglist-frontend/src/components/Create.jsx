import { useState } from "react";

export const Create = ({ handleSave }) => {
	const [title, setTitle] = useState(null);
	const [author, setAuthor] = useState(null);
	const [url, setUrl] = useState(null);

	return (
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

			<button type="button" onClick={() => handleSave({ title, author, url })}>
				create
			</button>
		</div>
	);
};
