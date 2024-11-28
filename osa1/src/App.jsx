import { Part } from "./components/Part";
import { Header } from "./components/header";
import { Total } from "./components/total";

const App = () => {
	const course = {
		name: "Half Stack application development",
		parts: [
			{ name: "Fundamentals of React", exercises: 10 },
			{ name: "Using props to pass data", exercises: 7 },
			{ name: "State of a component", exercises: 14 },
		],
	};

	const totalExercises = course.parts.reduce((a, b) => a + b.exercises, 0);

	return (
		<div>
			<Header course={course.name} />
			{course.parts.map((part) => (
				<Part key={part.name} name={part.name} exercises={part.exercises} />
			))}
			<Total total={totalExercises} />
		</div>
	);
};

export default App;
