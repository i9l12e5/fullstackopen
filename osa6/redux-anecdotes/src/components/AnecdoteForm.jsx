import { useState } from "react";
import { useDispatch } from "react-redux";
import { newAnecdote } from "../reducers/anecdoteReducer";
import {
	hideNotification,
	showNotification,
} from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
	const dispatch = useDispatch();
	const [anecdote, setAnecdote] = useState("");

	const createAnectode = async () => {


		dispatch(showNotification(`Added new anecdote: ${anecdote}.`));
		dispatch(newAnecdote(anecdote));

		const timeoutId = setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);

		return () => clearTimeout(timeoutId);
	};

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
