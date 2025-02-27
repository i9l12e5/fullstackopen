import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotifProvider } from "./contexts/NotifContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<NotifProvider>
			<App />
		</NotifProvider>
	</QueryClientProvider>,
);
