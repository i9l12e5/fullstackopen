import { useEffect, useState } from "react";
import { UserForm } from "./components/userForm";
import { UserList } from "./components/userList";
import { FilterInput } from "./components/filterInput";
import axios from "axios";
import { SnackPopup } from "./components/snackPopup";

const App = () => {
	const baseUrl = process.env.NODE_ENV ? "" : "http://localhost:3001";
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filterString, setFilterString] = useState("");
	const [snackMessage, setSnackMessage] = useState({
		show: false,
		type: null,
		msg: null,
	});

	const updateName = (text) => setNewName(text.target.value);

	const filterName = (text) => setFilterString(text.target.value);

	const updateNumber = (number) => setNewNumber(number.target.value);

	const snackMsg = (show, type, msg) =>
		setSnackMessage({ show: show, type: type, msg: msg });

	const clearSnack = () =>
		setTimeout(() => {
			setSnackMessage({ show: false, type: null, msg: null });
		}, 5000);

	const checkNames = (name) => {
		const find = persons.find((list) => list.name === name);

		if (find === undefined) return false;

		if (
			find.number !== newNumber &&
			window.confirm(
				`${find.name} is already added to phonebook, replace the old number (${find.number}) with a new one (${newNumber})?`,
			)
		) {
			axios
				.put(`${baseUrl}/api/persons/${find.id}`, {
					...find,
					number: newNumber,
				})
				.then(() =>
					snackMsg(
						true,
						2,
						`${newName}'s phone number updated to ${newNumber}`,
					),
				)
				.catch((e) => {
					if (e.status === 404)
						snackMsg(
							true,
							3,
							`Cannot update phone number, contact ${newName} has been deleted`,
						);
					else snackMsg(true, 3, `Failed to update ${newName}'s phone number`);
				})
				.finally(() => fetchContacts());
		} else {
			snackMsg(true, 3, `${newName} is already added to phonebook`);
		}

		return true;
	};

	const handleNewName = (event) => {
		event.preventDefault();

		if (newName === "" || checkNames(newName)) return;

		axios
			.post(`${baseUrl}/api/persons`, {
				name: newName,
				number: newNumber,
				/* id: persons.length + 1, */
			})
			.then(() => snackMsg(true, 1, `Added ${newName} to phonebook`))
			.then(() => fetchContacts())
			.catch(() => snackMsg(true, 3, `Failed to add ${newName} as contact`));
	};

	const filteredResults = () => {
		const filtered = persons.filter(
			(names) =>
				names.name.toLocaleLowerCase().includes(filterString) ||
				names.number.includes(filterString),
		);

		return filterString !== "" ? filtered : persons;
	};

	const handleDelete = (contact) => {
		const getName = persons.find((user) => user.id === contact);

		if (window.confirm(`Delete ${getName.name}`)) {
			axios
				.delete(`${baseUrl}/api/persons/${contact}`)
				.then(() => snackMsg(true, 3, `Deleted ${getName.name} from phonebook`))
				.then(fetchContacts())
				.catch((e) => {
					if (e.status === 404)
						snackMsg(true, 3, `Error: ${getName.name} is already removed`);
					else snackMsg(true, 3, "Unknown error");
				});
		}
	};

	const fetchContacts = () =>
		axios
			.get(`${baseUrl}/api/persons/`)
			.then((response) => {
				setPersons(response.data);
			})
			.catch(() => snackMsg(true, 3, "Fetch failed"))
			.finally(() => clearSnack());

	useEffect(() => {
		fetchContacts();
	}, []);

	return (
		<div>
			<h2>Phonebook</h2>

			<SnackPopup props={snackMessage} />

			<FilterInput filterName={filterName} />

			<UserForm
				updateName={updateName}
				updateNumber={updateNumber}
				handleNewName={handleNewName}
			/>

			<UserList list={filteredResults()} handleContactDelete={handleDelete} />
		</div>
	);
};

export default App;
