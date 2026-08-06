/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EE',
        darkBrown: '#4D342B',
        woodBrown: '#6D4C41',
        gold: '#B08D57',
        ink: '#222222',
        muted: '#777777',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
        '10xl': '8rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      boxShadow: {
        warm: '0 8px 40px rgba(0,0,0,0.08)',
        'warm-lg': '0 20px 60px rgba(0,0,0,0.12)',
        'warm-xl': '0 30px 80px rgba(0,0,0,0.16)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #F7F4EE 0%, #EDE8DF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #4D342B 0%, #6D4C41 100%)',
        'gradient-gold': 'linear-gradient(135deg, #B08D57 0%, #C9A86C 100%)',
      },
    },
  },
  plugins: [],
}
