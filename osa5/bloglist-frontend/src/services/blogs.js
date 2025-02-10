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

const removeBlog = (blog, user) =>
	axios.delete(`${BASE_URL}${API_PATH}/${blog}`, {
		headers: {
			Authorization: `Bearer ${user}`,
		},
	});

export default { getAll, postNew, addLike, removeBlog };
