import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import {
	hideNotification,
	showNotification,
} from "../reducers/notificationReducer";

const AnecdoteList = () => {
	const filter = useSelector((state) => state.filter);

	const anecdotes = useSelector((state) => {
		if (filter !== "")
			return state.anecdotes.filter((anecdote) =>
				anecdote.content.toLowerCase().includes(state.search),
			);

		return state.anecdotes;
	});

	const dispatch = useDispatch();
	const vote = (anecdote) => {
		dispatch(showNotification(`you voted '${anecdote.content}'`));
		dispatch(addVote(anecdote.id));

		const timeoutId = setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);

		return () => clearTimeout(timeoutId);
	};

	if (anecdotes.length < 1) return null;

	return anecdotes
		.sort((a, b) => b.votes - a.votes)
		.map((anecdote) => (
			<div key={anecdote.id}>
				<div>{anecdote.content}</div>
				<div>
					has {anecdote.votes}
					<button type="button" onClick={() => vote(anecdote)}>
						vote
					</button>
				</div>
			</div>
		));
};

export default AnecdoteList;
