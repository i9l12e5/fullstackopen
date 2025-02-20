import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import filterReducer from "./reducers/filterReducer";
import { createStore, combineReducers } from "redux";
import anecdoteReducer from "./reducers/anecdoteReducer";

const reducer = combineReducers({
	search: filterReducer,
	anecdotes: anecdoteReducer,
});

const store = createStore(reducer);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
