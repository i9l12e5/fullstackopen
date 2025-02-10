const User = ({ data, handleClick }) => (
	<div>
		{data?.name || "Nimetön"} logged in{" "}
		<button type="button" onClick={handleClick}>
			logout
		</button>
	</div>
);

export default User;
