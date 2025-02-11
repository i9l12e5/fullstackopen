import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Create } from "./Create";

const newBlog = { title: "testi", author: "testaaja", url: "na" };

test("Create blog should receive proper data", async () => {
	const test = userEvent.setup();

	const createBlog = vi.fn();

	const { container } = render(<Create handleSave={createBlog} />);

	const buttonCreate = container.querySelector("#open-create-blog-button");

	await test.click(buttonCreate);

	const input1 = container.querySelector("#title-input");

	await test.type(input1, newBlog.title);

	const input2 = container.querySelector("#author-input");

	await test.type(input2, newBlog.author);

	const input3 = container.querySelector("#url-input");

	await test.type(input3, newBlog.url);

	const buttonSend = container.querySelector("#create-button");

	await test.click(buttonSend);

	expect(createBlog.mock.calls).toHaveLength(1);
	expect(createBlog.mock.calls[0][0].title).toBe(newBlog.title);
	expect(createBlog.mock.calls[0][0].author).toBe(newBlog.author);
	expect(createBlog.mock.calls[0][0].url).toBe(newBlog.url);
});
