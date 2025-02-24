import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const saveOne = async (body) => {
	const response = await axios.post(baseUrl, body);
	return response.data;
};

const updateVote = async (body) => {
	const response = await axios.put(baseUrl, body);
	return response.data;
};

export default { getAll, saveOne, updateVote };
