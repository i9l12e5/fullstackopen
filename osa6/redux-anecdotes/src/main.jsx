import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import { setAnecdote } from "./reducers/anecdoteReducer";
import anecdoteService from "./services/anecdotes";

anecdoteService.getAll().then((anecdote) => {
	store.dispatch(setAnecdote(anecdote))
})

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
