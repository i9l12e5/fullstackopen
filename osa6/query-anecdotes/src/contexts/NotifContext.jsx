import { useContext } from "react";
import { createContext, useReducer } from "react";

const NotifContext = createContext();

const messageReducer = (state, action) => {
	switch (action.type) {
		case "VOTE":
			return `You voted for ${action.anecdote}`;

		case "NEW":
			return `New anecdote: '${action.anecdote}' created successfully!`;

		case "HIDE":
			return "";

		case "ERROR":
			return action.message;

		default:
			return state; // ?
	}
};

export const NotifProvider = ({ children }) => {
	const [message, messageDispatch] = useReducer(messageReducer, "");

	return (
		<NotifContext.Provider value={[message, messageDispatch]}>
			{children}
		</NotifContext.Provider>
	);
};

export const showMessage = () => {
	const message = useContext(NotifContext);

	return message[0];
};

export const sendMessage = () => {
	const message = useContext(NotifContext);

	return message[1];
};

export default NotifContext;
