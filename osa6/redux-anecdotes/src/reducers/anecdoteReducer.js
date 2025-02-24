import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
import { hideNotification, showNotification } from "./notificationReducer";

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

			// Save vote increment to db
			const response = async () =>
				await anecdoteService.updateVote(changedAnecdote);

			response();

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

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch(setAnecdote(anecdotes));
	};
};

export const createAnecdote = (anecdote) => {
	return (dispatch) => {
		dispatch(showNotification(`Added new anecdote: ${anecdote}.`));
		dispatch(newAnecdote(anecdote));

		const timeoutId = setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);

		return clearTimeout(timeoutId);
	};
};

export const handleVote = (anecdote) => {
	return (dispatch) => {
		dispatch(showNotification(`you voted '${anecdote.content}'`));
		dispatch(addVote(anecdote.id));

		const timeoutId = setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);

		return clearTimeout(timeoutId);
	};
};
export default anecdoteSlice.reducer;
