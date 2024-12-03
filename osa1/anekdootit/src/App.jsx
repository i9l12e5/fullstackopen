import { useState } from "react";

const App = () => {
	const anecdotes = [
		"If it hurts, do it more often.",
		"Adding manpower to a late software project makes it later!",
		"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
		"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		"Premature optimization is the root of all evil.",
		"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
		"Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
		"The only way to go fast, is to go well.",
	];

	const amount = anecdotes.length;
	const array = Array(amount).fill(0);

	const [votes, setVotes] = useState(array);
	const [selected, setSelected] = useState(0);

	const giveVote = (value) => {
		setVotes((prev) => {
			const updatedVotes = [...prev];
			updatedVotes[value] += 1;
			return updatedVotes;
		});
	};

	const mostVoted = () => {
		const voted = Math.max(...votes);
		const fetch = votes.indexOf(voted);
		return fetch;
	};

	const getMostVoted = anecdotes[mostVoted()];

	const nextAnecdote = () => {
		const randomNumber = Math.ceil(Math.random() * anecdotes.length) - 1;
		setSelected(randomNumber);
	};

	return (
		<div>
			<h1>Anecdote of the day</h1>
			<div>{anecdotes[selected]}</div>
			<div>has {votes[selected]} votes</div>
			<div>
				<button type="button" onClick={() => giveVote(selected)}>
					vote
				</button>
				<button type="button" onClick={nextAnecdote}>
					next
				</button>
			</div>

			<div>
				<div>
					<h1>Anecdote with most votes</h1>
				</div>
				<div>{getMostVoted}</div>
			</div>
		</div>
	);
};

export default App;
