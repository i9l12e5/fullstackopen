import PropTypes from "prop-types";

export const Status = ({ message, success }) => (
	<div
		style={{
			display: message ? "flex" : "none",
			backgroundColor: "silver",
			color: success ? "green" : "red",
			borderStyle: "solid",
			borderWidth: "5px",
			borderColor: success ? "green" : "red",
			borderRadius: "4px",
			padding: "10px",
		}}
	>
		{message}
	</div>
);

Status.propTypes = {
	message: PropTypes.string,
	success: PropTypes.bool.isRequired,
};
