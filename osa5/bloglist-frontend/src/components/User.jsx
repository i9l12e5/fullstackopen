import PropTypes from "prop-types";

const User = ({ data, handleClick }) => (
	<div>
		{data?.name || "Nimetön"} logged in{" "}
		<button type="button" onClick={handleClick}>
			logout
		</button>
	</div>
);

User.propTypes = {
	data: PropTypes.shape({
		name: PropTypes.string,
	}),
	handleClick: PropTypes.func,
};

export default User;
