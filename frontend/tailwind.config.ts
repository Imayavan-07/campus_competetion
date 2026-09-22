import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D4ED8',
          hover: '#1e40af',
          light: '#eff6ff',
        },
        secondary: {
          DEFAULT: '#16A34A',
          hover: '#15803d',
          light: '#f0fdf4',
        },
        tertiary: {
          DEFAULT: '#F59E0B',
          hover: '#d97706',
          light: '#fffbeb',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
