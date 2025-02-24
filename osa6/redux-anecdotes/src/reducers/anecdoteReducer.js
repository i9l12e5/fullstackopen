import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);
const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0,
	};
};

const anecdoteSlice = createSlice({
	name: "anecdotes",
	initialState: [],
	reducers: {
		addVote(state, action) {
			const id = action.payload;
			const anecdoteToChange = state.find((a) => a.id === id);
			const changedAnecdote = {
				...anecdoteToChange,
				votes: anecdoteToChange.votes + 1,
			};

			/* anecdoteService.updateVote(changedAnecdote); */

			return state.map((anecdote) =>
				anecdote.id !== id ? anecdote : changedAnecdote,
			);
		},
		newAnecdote(state, action) {
			const convert = asObject(action.payload);
			state.push(convert);
			anecdoteService.saveOne(convert);
		},
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		setAnecdote(state, action) {
			return action.payload;
		},
	},
});

export const { addVote, newAnecdote, appendAnecdote, setAnecdote } =
	anecdoteSlice.actions;

export const initializeAnecdotes = () =>
	anecdoteService.getAll().then((anecdote) => {
		store.dispatch(setAnecdote(anecdote));
	});

export default anecdoteSlice.reducer;
