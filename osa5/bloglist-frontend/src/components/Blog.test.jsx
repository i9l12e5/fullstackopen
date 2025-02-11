import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const user = {
	id: "1",
};

const blog = {
	id: "a",
	title: "jotakin",
	author: "joku",
	likes: 0,
	url: "na",
	user: {
		username: "testaaja",
		id: "1",
	},
};

test("Render blog info", async () => {
	const mockHandler = vi.fn();

	render(
		<Blog
			blog={blog}
			user={user}
			handleLikeAdd={mockHandler}
			handleRemove={mockHandler}
		/>,
	);

	const test = userEvent.setup();

	const button = screen.getByText("view");

	await test.click(button);

	const element1 = screen.getByText(`${blog.title} ${blog.author}`);
	const element2 = screen.getByText(`${blog.url}`);
	const element3 = screen.getByText(`likes ${blog.likes}`);
	const element4 = screen.getByText(`${blog.user.username}`);

	expect(element1).toBeDefined();
	expect(element2).toBeDefined();
	expect(element3).toBeDefined();
	expect(element4).toBeDefined();
});

test("Verify like button is pressed twice", async () => {
	const mockHandler = vi.fn();

	render(
		<Blog
			blog={blog}
			user={user}
			handleLikeAdd={mockHandler}
			handleRemove={mockHandler}
		/>,
	);

	const test = userEvent.setup();

	const button1 = screen.getByText("view");

	await test.click(button1);

	const button2 = screen.getByText("like");

	await test.click(button2);

	expect(mockHandler.mock.calls).toHaveLength(1);

	await test.click(button2);

	expect(mockHandler.mock.calls).toHaveLength(2);
});
