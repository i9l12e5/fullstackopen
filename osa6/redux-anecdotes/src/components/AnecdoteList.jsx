import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
	const anecdotes = useSelector((state) => {
		if (state.search !== "")
			return state.anecdotes.filter((anecdote) =>
				anecdote.content.toLowerCase().includes(state.search),
			);

		return state.anecdotes;
	});

	const dispatch = useDispatch();
	const vote = (id) => dispatch(addVote(id));

	return anecdotes
		.sort((a, b) => b.votes - a.votes)
		.map((anecdote) => (
			<div key={anecdote.id}>
				<div>{anecdote.content}</div>
				<div>
					has {anecdote.votes}
					<button type="button" onClick={() => vote(anecdote.id)}>
						vote
					</button>
				</div>
			</div>
		));
};

export default AnecdoteList;
