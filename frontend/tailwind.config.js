export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f315c',
          light: '#0f315c',
          dark: '#FF6500',
        },
        secondary: {
          DEFAULT: '#466588',
          light: '#466588',
          dark: '#00d2ff',
        },
        terciary:{
          DEFAULT: '#3e001d',
          light: '#3e001d',
          dark: '#aa4402',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
