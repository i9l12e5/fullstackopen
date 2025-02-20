import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../reducers/filterReducer";
import anecdoteReducer from "../reducers/anecdoteReducer";

export const store = configureStore({
	reducer: {
		search: filterReducer,
		anecdotes: anecdoteReducer,
	},
});
