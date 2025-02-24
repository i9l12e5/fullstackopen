import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import { setAnecdote } from "./reducers/anecdoteReducer";

const dispatch = useDispatch();

useEffect(() => {
	dispatch(setAnecdote());
}, [])

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
