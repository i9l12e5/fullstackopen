import axios from "axios";
import { BASE_URL } from "../utils/config";

const login = async (data) =>
	await axios
		.post(`${BASE_URL}/login`, data)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			return error.response;
		});

export default { login };
