import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		searchAnectodes(state, action) {
			return action.payload;
		},
	},
});

export const { searchAnectodes } = filterSlice.actions;
export default filterSlice.reducer;
