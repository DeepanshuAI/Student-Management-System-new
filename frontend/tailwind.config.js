/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        xl: '14px',
        '2xl': '16px',
      },
      boxShadow: {
        soft:
          '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 4px 12px -2px rgb(0 0 0 / 0.08)',
        'soft-lg':
          '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 12px 24px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
