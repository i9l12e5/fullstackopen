import axios from "axios";
import { BASE_URL } from "../utils/config";

const API_PATH = "/api/blogs";

const getAll = () =>
	axios.get(BASE_URL + API_PATH).then((response) => response.data);

const postNew = (body, user) =>
	axios
		.post(BASE_URL + API_PATH, body, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		})
		.then((response) => response);

const addLike = (body) =>
	axios
		.put(`${BASE_URL}${API_PATH}/update/${body.id}`, body)
		.then((response) => response);

export default { getAll, postNew, addLike };
