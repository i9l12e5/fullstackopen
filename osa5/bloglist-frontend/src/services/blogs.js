import axios from "axios";
import { BASE_URL } from "../utils/config";

const API_PATH = "/api/blogs";

const getAll = () => axios.get(API_PATH).then((response) => response.data);

const postNew = (body, user) =>
	axios
		.post(API_PATH, body, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		})
		.then((response) => response);

const addLike = (body) =>
	axios.put(`${API_PATH}/update/${body.id}`, body).then((response) => response);

const removeBlog = (blog, user) =>
	axios.delete(`${API_PATH}/${blog}`, {
		headers: {
			Authorization: `Bearer ${user}`,
		},
	});

export default { getAll, postNew, addLike, removeBlog };
