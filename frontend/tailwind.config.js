/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbf0',
          100: '#fef3e2',
          200: '#fce7c4',
          300: '#fadaa7',
          400: '#f7c86a',
          500: '#f5b62d',
          600: '#d69d28',
          700: '#b37f1f',
          800: '#8f621a',
          900: '#744b16',
        },
        cream: {
          50: '#fefdfb',
          100: '#fffbf0',
          200: '#fef3e2',
          300: '#fce7c4',
          400: '#fadaa7',
          500: '#f5b62d',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
      },
    },
  },
  plugins: [],
};
