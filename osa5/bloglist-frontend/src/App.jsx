import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import User from "./components/User";
import { Create } from "./components/Create";
import { Status } from "./components/Status";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [isLogged, setIsLogged] = useState(false);
	const [user, setUser] = useState(null);
	const [status, setStatus] = useState(false);
	const [message, setMessage] = useState(null);

	const fetchBlogs = async () =>
		await blogService.getAll().then((blogs) => setBlogs(blogs));

	const userLogout = () => {
		setIsLogged(false);
		setUser(null);
		window.localStorage.clear("blogUserLoggedIn");
	};

	const handleLogin = async (body) => {
		if (!body.username || !body.password) return; // Catch empty

		const result = await loginService.login(body);

		if (result.status === 200) {
			setMessage(null);
			setIsLogged(true);
			window.localStorage.setItem(
				"blogUserLoggedIn",
				JSON.stringify(result.data),
			);
			return;
		}

		if (result.status === 401) {
			setIsLogged(false);
			setStatus(false);
			setMessage(result.data.error);
			return;
		}

		setStatus(false);
		setMessage(result?.data?.error || result?.data || "Jotakin meni vikaan!"); // Catch all for rest non-200/401 responses
	};

	const handleSave = async (body) => {
		const result = await blogService.postNew(body, user);

		if (result.status === 201) {
			setMessage(
				`a new blog ${result.data.title} by ${result.data.author} added`,
			);
			setStatus(true);
			fetchBlogs();
		} else {
			setMessage("Jotakin meni vikaan!");
			setStatus(false);
		}
	};

	useEffect(() => {
		const test = window.localStorage.getItem("blogUserLoggedIn");

		if (test) {
			const parseUser = JSON.parse(test);

			if (parseUser) {
				setUser(parseUser);
				fetchBlogs();
				setIsLogged(true);
			} else {
				userLogout();
				setMessage("Virheellinen token!");
			}
		}
	}, [isLogged]);

	return isLogged ? (
		<div>
			<h2>blogs</h2>
			<Status message={message} success={status} />
			<User data={user} handleClick={userLogout} />
			<Create user={user} handleSave={handleSave} />

			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	) : (
		<div>
			<Login handleLogin={handleLogin} />
			<Status message={message} success={status} />
		</div>
	);
};

export default App;
