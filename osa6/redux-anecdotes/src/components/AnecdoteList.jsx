import { useDispatch, useSelector } from "react-redux";
import { handleVote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
	const dispatch = useDispatch();
	const filter = useSelector((state) => state.filter);

	const anecdotes = useSelector((state) => {
		if (filter && filter !== "")
			return state.anecdotes.filter((anecdote) =>
				anecdote.content.toLowerCase().includes(state.search),
			);

		return state.anecdotes;
	});

	const vote = (anecdote) => dispatch(handleVote(anecdote));

	if (anecdotes.length < 1) return null;

	const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

	return sortedAnecdotes.map((anecdote) => (
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
