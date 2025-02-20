import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
	const handleChange = (type) => {
		store.dispatch({
			type: type,
		});
	};

	return (
		<div>
			<button type="button" onClick={() => handleChange("GOOD")}>
				good
			</button>
			<button type="button" onClick={() => handleChange("OK")}>
				ok
			</button>
			<button type="button" onClick={() => handleChange("BAD")}>
				bad
			</button>
			<button type="button" onClick={() => handleChange("ZERO")}>
				reset stats
			</button>
			<div>good {store.getState().good}</div>
			<div>ok {store.getState().ok}</div>
			<div>bad {store.getState().bad}</div>
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
	root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
