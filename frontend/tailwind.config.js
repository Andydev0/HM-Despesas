/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'hm-pink': {
          DEFAULT: '#D12E7F',
          dark: '#B01E6F',
        },
        'hm-blue': {
          DEFAULT: '#1A2D7C',
          dark: '#152366',
        }
      }
    },
  },
  plugins: [],
}

