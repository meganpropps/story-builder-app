/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          magic: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          fairytale: {
            cream: '#FFF8F0',
            gold: '#FFD700',
            rose: '#FFB6C1',
            sky: '#87CEEB',
            forest: '#228B22',
          }
        },
        backgroundImage: {
          'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          'starry': "url('/starry-bg.jpg')",
          'parchment': "url('/parchment-bg.jpg')",
        },
        backdropBlur: {
          xs: '2px',
        },
        boxShadow: {
          'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          'glow': '0 0 20px rgba(168, 85, 247, 0.4)',
          'magic': '0 0 30px rgba(216, 180, 254, 0.6)',
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'sparkle': 'sparkle 1.5s ease-in-out infinite',
          'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
          'magic-appear': 'magic-appear 0.6s ease-out',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          sparkle: {
            '0%, 100%': { opacity: '1', transform: 'scale(1)' },
            '50%': { opacity: '0.5', transform: 'scale(1.1)' },
          },
          'glow-pulse': {
            '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
            '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
          },
          'magic-appear': {
            '0%': { opacity: '0', transform: 'scale(0.8) rotate(-5deg)' },
            '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          }
        }
      },
    },
    plugins: [],
  }