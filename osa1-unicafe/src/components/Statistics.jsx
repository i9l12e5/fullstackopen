import { StatisticsLine } from "./StatisticsLine";

const Statistics = ({ props }) => {
	return (
		<>
			<h1>statistics</h1>

			{props.all === 0 ? (
				<>No feedback given</>
			) : (
				<table>
					<StatisticsLine text={"good"} value={props.good} />
					<StatisticsLine text={"neutral"} value={props.neutral} />
					<StatisticsLine text={"bad"} value={props.bad} />
					<StatisticsLine text={"all"} value={props.all} />
					<StatisticsLine
						text={"average"}
						value={Number(props.average).toFixed(1)}
					/>
					<StatisticsLine
						text={"positive"}
						value={`${Number(props.positive).toFixed(1)} %`}
					/>
				</table>
			)}
		</>
	);
};

export default Statistics;
