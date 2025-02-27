import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { sendMessage } from "./contexts/NotifContext";
import { getAnecdotes, voteAnecdote } from "./requests";

const App = () => {
	const dispatch = sendMessage();

	const queryClient = useQueryClient();

	const voteMutation = useMutation({
		mutationFn: voteAnecdote,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
			dispatch({ type: "VOTE", anecdote: data.content });
		},
	});

	const result = useQuery({
		queryKey: ["anecdotes"],
		queryFn: getAnecdotes,
	});

	/* console.log(JSON.parse(JSON.stringify(result))); */

	const handleVote = (anecdote) => {
		voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
	};

	if (result.isError) {
		return <div>anecdote server is not currently available</div>;
	}

	if (result.isLoading) {
		return <div>loading data...</div>;
	}

	const anecdotes = result.data;

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button type="button" onClick={() => handleVote(anecdote)}>
							vote
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
