import PropTypes from "prop-types";
import { useState } from "react";

const Login = ({ handleLogin }) => {
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);

	const handleUsername = (text) => {
		setUsername(text.target.value);
	};

	const handlePassword = (text) => {
		setPassword(text.target.value);
	};

	const isDisabled = Boolean(!username || !password);

	const clickLogin = () => handleLogin({ username, password });

	return (
		<div>
			<div>
				Username: <input onChange={handleUsername} />
			</div>
			<div>
				Password: <input onChange={handlePassword} />
			</div>
			<button type="button" disabled={isDisabled} onClick={clickLogin}>
				Login
			</button>
			{/* <button type="button">cancel</button> */}
		</div>
	);
};

Login.propTypes = {
	handleLogin: PropTypes.func.isRequired,
};

export default Login;
