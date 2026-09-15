/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c3d7e9',
          300: '#95bbd9',
          400: '#6199c5',
          500: '#3c7db1',
          600: '#2c6494',
          700: '#245077',
          800: '#1e4060',
          900: '#1b3752',
          950: '#112234', // Dignified Deep Navy
        },
        surface: '#ffffff',
        muted: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', '"Sarabun"', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans Thai"', '"Sarabun"', 'sans-serif'],
        body: ['"IBM Plex Sans Thai"', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
