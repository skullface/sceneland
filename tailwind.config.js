/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      sans: [
        'DM Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        'Noto Sans',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
      ],
      mono: [
        'Fragment Mono',
        'ui-monospace',
        'SFMono-Regular',
        'SF Mono',
        'Menlo',
        'Consolas',
        'Liberation Mono',
        'monospace',
      ],
    },
    extend: {},
  },
  plugins: [],
}
