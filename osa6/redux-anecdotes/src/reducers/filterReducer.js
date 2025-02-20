const filterReducer = (state, action) => {
	switch (action.type) {
		case "FILTER": {
			return action.search; // passes the search word
		}

		default:
			return state; // ?
	}
};

export const filterAnectodes = (search) => {
	return {
		type: "FILTER",
		search,
	};
};

export default filterReducer;
