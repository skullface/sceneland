/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',   // original gray-50
          100: '#f3f4f6',  // original gray-100
          200: '#e5e7eb',  // original gray-200
          300: '#d1d5db',  // original gray-300
          400: '#9ca3af',  // original gray-400
          500: '#6b7280',  // original gray-500
          600: '#4b5563',  // original gray-600
          700: '#374151',  // original gray-700
          800: '#1f2937',  // original gray-800
          900: '#111827',  // original gray-900
        }
      }
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const grayColors = theme('colors.gray');
      const invertedGray = {
        50: grayColors[900],
        100: grayColors[800],
        200: grayColors[700],
        300: grayColors[600],
        400: grayColors[500],
        500: grayColors[400],
        600: grayColors[300],
        700: grayColors[200],
        800: grayColors[100],
        900: grayColors[50],
      };

      const darkModeUtilities = {};
      
      // Generate utilities for all gray color variations
      Object.keys(invertedGray).forEach(shade => {
        // Background colors
        darkModeUtilities[`.dark .bg-gray-${shade}`] = {
          'background-color': invertedGray[shade],
        };
        // Text colors
        darkModeUtilities[`.dark .text-gray-${shade}`] = {
          'color': invertedGray[shade],
        };
        // Border colors
        darkModeUtilities[`.dark .border-gray-${shade}`] = {
          'border-color': invertedGray[shade],
        };
        // Ring colors
        darkModeUtilities[`.dark .ring-gray-${shade}`] = {
          '--tw-ring-color': invertedGray[shade],
        };
        // Decoration colors
        darkModeUtilities[`.dark .decoration-gray-${shade}`] = {
          'text-decoration-color': invertedGray[shade],
        };
        // Accent colors
        darkModeUtilities[`.dark .accent-gray-${shade}`] = {
          'accent-color': invertedGray[shade],
        };
      });

      addUtilities(darkModeUtilities);
    }
  ],
}
