/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E31837', // Vibrant Red
          dark: '#B0142B',
          light: '#FFEDED',
        },
        secondary: {
          DEFAULT: '#FFB30E', // Turmeric Orange/Yellow
          dark: '#E69E00',
        },
        accent: {
          DEFAULT: '#2D6A4F', // Deep Green
          light: '#EAF4EE',
        },
        neutral: {
          900: '#1A1A1A', // Deep Charcoal
          100: '#F8F9FA',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'small': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'standard': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
