// tailwind.config.js
module.exports = {
	darkMode: 'class', // ← important
	content: [
	  './app/**/*.{ts,tsx}',
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	],
	theme: {
	  extend: {},
	},
	plugins: [],
  };