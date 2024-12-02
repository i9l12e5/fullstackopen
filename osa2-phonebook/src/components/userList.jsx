export const UserList = ({ list, handleContactDelete }) => {
	return (
		<>
			<h2>Numbers</h2>
			{list.map((names) => (
				<div key={names.id}>
					{names.name} {names.number}
					<button type="button" onClick={() => handleContactDelete(names.id)}>
						delete
					</button>
				</div>
			))}
		</>
	);
};
