import axios from "axios";
import { BASE_URL } from "../utils/config";

const login = (data) =>
	axios
		.post("/login", data)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			return error.response;
		});

export default { login };
