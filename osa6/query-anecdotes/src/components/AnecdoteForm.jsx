import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../contexts/NotifContext";
import { newAnectode } from "../requests";

const AnecdoteForm = () => {
	const queryClient = useQueryClient();
	const dispatch = sendMessage();

	const newAnecdoteMutation = useMutation({
		mutationFn: newAnectode,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
		},
		onError: (error) => {
			dispatch({ type: "ERROR", message: error.response.data.error });
		},
	});

	const onCreate = (event) => {
		event.preventDefault();

		const getId = () => (100000 * Math.random()).toFixed(0);
		const asObject = (anecdote) => {
			return {
				content: anecdote,
				id: getId(),
				votes: 0,
			};
		};

		const content = event.target.anecdote.value;
		event.target.anecdote.value = "";

		newAnecdoteMutation.mutate(asObject(content));
		dispatch({ type: "NEW", anecdote: content });
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
