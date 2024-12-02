import { Part } from "./components/Part";
import { Header } from "./components/header";
import { Total } from "./components/total";
import { courses } from "./data/courses";

const App = () => {
	const totalExercises = (course) =>
		course.parts.reduce((a, b) => a + b.exercises, 0);

	return courses.map((course) => (
		<div key={course.id}>
			<Header course={course.name} />

			{course.parts.map((part) => (
				<Part key={part.id} name={part.name} exercises={part.exercises} />
			))}

			<Total total={totalExercises(course)} />
		</div>
	));
};

export default App;
