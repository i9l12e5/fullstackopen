import { useEffect } from "react";
import { sendMessage, showMessage } from "../contexts/NotifContext";

const Notification = () => {
	const message = showMessage();
	const hideNotif = sendMessage();

	const style = {
		display: message ? "flex" : "none",
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	};

	useEffect(() => {
		if (message.length > 0) {
			const timer = setTimeout(() => {
				hideNotif({ type: "HIDE" });
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [message, hideNotif]);

	/* if (!message) return null; */ // Causes previous message to be rendered for split second

	return <div style={style}>{message}</div>;
};

export default Notification;
