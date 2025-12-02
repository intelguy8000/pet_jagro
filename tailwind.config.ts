import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7CB9E8',
          light: '#B4D4E7',
          dark: '#5B9BD5',
          50: '#F0F7FC',
          100: '#E1EFF9',
          200: '#B4D4E7',
          300: '#7CB9E8',
          400: '#5B9BD5',
          500: '#4A90C9',
          600: '#3A7AB3',
          700: '#2D6599',
          800: '#1F4F7F',
          900: '#143A66',
        },
        surface: '#F8FAFC',
        border: '#E2E8F0',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
