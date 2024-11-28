import { useState } from "react";
import Statistics from "./components/Statistics";

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const all = good + neutral + bad;
	const average = (good * 1 + bad * -1) / all;
	const positive = (good / all) * 100;

	const giveGood = () => {
		setGood((prevGood) => prevGood + 1);
	};

	const giveNeutral = () => {
		setNeutral((prevNeutral) => prevNeutral + 1);
	};

	const giveBad = () => {
		setBad((prevBad) => prevBad + 1);
	};

	return (
		<div>
			<h1>give feedback</h1>
			<div>
				<button type="button" onClick={giveGood}>
					good
				</button>
				<button type="button" onClick={giveNeutral}>
					neutral
				</button>
				<button type="button" onClick={giveBad}>
					bad
				</button>
			</div>

			<Statistics
				props={{
					good,
					neutral,
					bad,
					all,
					average,
					positive,
				}}
			/>
		</div>
	);
};

export default App;
