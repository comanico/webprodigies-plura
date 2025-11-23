import { withUt } from "uploadthing/tw";

module.exports = withUt({

    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
    ],
});