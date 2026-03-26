/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT:'#BFA06A', light:'#D4B896', dark:'#8C6D3F' },
      },
      fontFamily: {
        display: ["'Cormorant'", 'Georgia', 'serif'],
        serif:   ["'EB Garamond'", 'Georgia', 'serif'],
        sans:    ["'Montserrat'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
