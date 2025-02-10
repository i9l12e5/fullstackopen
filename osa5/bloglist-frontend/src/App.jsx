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

	const fetchBlogs = () =>
		blogService.getAll().then((blogs) => setBlogs(blogs));

	const userLogout = () => {
		setIsLogged(false);
		setUser(null);
		window.localStorage.clear("blogUserLoggedIn");
	};

	const handleLogin = (body) => {
		if (!body.username || !body.password) return; // Catch empty

		loginService
			.login(body)
			.then((response) => {
				if (response.status === 200) {
					setMessage(null);
					setIsLogged(true);
					window.localStorage.setItem(
						"blogUserLoggedIn",
						JSON.stringify(response.data),
					);
					return;
				}

				if (response.status === 401) {
					setIsLogged(false);
					setStatus(false);
					setMessage(response.data.error);
					return;
				}
			})
			.catch((error) => {
				setStatus(false);
				setMessage(error?.data?.error || "Jotakin meni vikaan!"); // Catch all for undefined errors
			});
	};

	const handleSave = (body) => {
		blogService
			.postNew(body, user)
			.then((response) => {
				if (response.status === 201) {
					setMessage(
						`a new blog ${response.data.title} by ${response.data.author} added`,
					);
					setStatus(true);
					fetchBlogs();
				} else {
					setMessage("Jotakin meni vikaan!");
					setStatus(false);
				}
			})
			.catch((error) => {
				setMessage(
					`Error ${error.response.status}:  ${error.response.statusText}`,
				);
				setStatus(false);
			});
	};

	const handleLikes = (body) => {
		blogService
			.addLike({
				...body,
				likes: body.likes + 1,
				user: body.user.id,
			})
			.then(() => fetchBlogs());
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
				<Blog key={blog.id} blog={blog} handleLikeAdd={handleLikes} />
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
