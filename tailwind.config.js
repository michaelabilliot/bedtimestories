/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        romance: {
          50: 'var(--color-light)',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: 'var(--color-primary)',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        'dreamy': {
          100: 'rgba(230, 240, 255, 0.1)',
          200: 'rgba(210, 230, 255, 0.2)',
          300: 'rgba(190, 220, 255, 0.3)',
          400: 'rgba(170, 210, 255, 0.4)',
          500: 'rgba(150, 200, 255, 0.5)',
          600: 'rgba(130, 190, 255, 0.6)',
          700: 'rgba(110, 180, 255, 0.7)',
          800: 'rgba(90, 170, 255, 0.8)',
          900: 'rgba(70, 160, 255, 0.9)',
        },
        'vintage': {
          100: 'rgba(255, 250, 240, 0.1)',
          200: 'rgba(250, 240, 225, 0.2)',
          300: 'rgba(245, 230, 210, 0.3)',
          400: 'rgba(240, 220, 195, 0.4)',
          500: 'rgba(235, 210, 180, 0.5)',
          600: 'rgba(230, 200, 165, 0.6)',
          700: 'rgba(225, 190, 150, 0.7)',
          800: 'rgba(220, 180, 135, 0.8)',
          900: 'rgba(215, 170, 120, 0.9)',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        cursive: ['Dancing Script', 'cursive'],
        dancing: ['Dancing Script', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        lato: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'heart-pattern': "url('/public/assets/themes/heart-pattern.png')",
        'stars-pattern': "url('/public/assets/themes/stars-pattern.png')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fadeInDown': 'fadeInDown 0.8s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
} 