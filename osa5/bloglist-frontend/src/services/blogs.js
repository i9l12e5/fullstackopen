import axios from "axios";
import { BASE_URL } from "../utils/config";

const API_PATH = "/api/blogs";

const getAll = () => {
	const request = axios.get(BASE_URL + API_PATH);
	return request.then((response) => response.data);
};

const postNew = (body, user) => {
	const request = axios.post(BASE_URL + API_PATH, body, {
		headers: {
			Authorization: `Bearer ${user.token}`,
		},
	});

	return request.then((res) => res);
};

export default { getAll, postNew };
