/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#6B7280",
        accent: "#F59E0B",
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F1F5F9",
      },
    },
  },
  plugins: [],
}
