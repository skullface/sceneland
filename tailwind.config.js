/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          0: '#ffffff',
          50: '#e7e7e7',
          100: '#d0d0d0',
          200: '#b9b9b9',
          300: '#a2a2a2',
          400: '#8c8c8c',
          500: '#777777',
          600: '#626262',
          700: '#4e4e4e',
          800: '#3b3b3b',
          900: '#292929',
          950: '#1a1a1a',
          1000: '#000000',
        },
      },
    },
  },
  plugins: [],
}
