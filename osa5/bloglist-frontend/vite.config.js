import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

VITE_API_URL=http://localhost:3003

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
				target: process.env.VITE_API_URL,
				changeOrigin: true,
			},
			"/login": {
				target: process.env.VITE_API_URL,
				changeOrigin: true,
			},
		},
	},
});
