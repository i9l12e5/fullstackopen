import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./testSetup.js",
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
			"/login": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
		},
	},
});
