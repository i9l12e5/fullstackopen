import { useState } from "react";
import { useDispatch } from "react-redux";
import { newAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
	const dispatch = useDispatch();
	const [anecdote, setAnecdote] = useState("");

	const createAnectode = () => dispatch(newAnecdote(anecdote));

	return (
		<div>
			<h2>create new</h2>
			<form>
				<div>
					<input onChange={(text) => setAnecdote(text.target.value)} />
				</div>
				<button type="button" onClick={createAnectode}>
					create
				</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
