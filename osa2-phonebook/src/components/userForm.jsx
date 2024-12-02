export const UserForm = ({ updateName, updateNumber, handleNewName }) => {
	return (
		<form>
			<div>
				name: <input onChange={updateName} />
			</div>
			<div>
				number: <input onChange={updateNumber} />
			</div>
			<div>
				<button type="submit" onClick={handleNewName}>
					add
				</button>
			</div>
		</form>
	);
};
