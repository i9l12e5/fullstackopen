export const FilterInput = ({ filterName }) => {
	return (
		<div>
			filter shown with <input onChange={filterName} />
		</div>
	);
};
