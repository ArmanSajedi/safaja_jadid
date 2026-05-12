import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wood and nature inspired colors for Lafoor Industries
        wood: {
          50: '#FAF7F0',
          100: '#F5EFDB',
          200: '#E8D5B7',
          300: '#DBBA93',
          400: '#D4A574',
          500: '#C8956D', // Main wood color
          600: '#B8835A',
          700: '#8B4513', // Saddle brown
          800: '#6B3410',
          900: '#4A240B',
        },
        forest: {
          50: '#F0F9F0',
          100: '#E0F2E0',
          200: '#C2E5C2',
          300: '#85CC85',
          400: '#4CAF4C',
          500: '#2E8B57', // Sea green
          600: '#228B22',
          700: '#1B5E1B',
          800: '#144414',
          900: '#0D2B0D',
        },
        cream: {
          50: '#FEFEFA',
          100: '#FCFCF2',
          200: '#F8F8E6',
          300: '#F5F5DC', // Beige
          400: '#F0F0C8',
          500: '#EBEBC0',
          600: '#D6D6A8',
          700: '#C1C190',
          800: '#9C9C78',
          900: '#777760',
        }
      },
      fontFamily: {
        'iran-sans': ['IRANSans', 'Tahoma', 'Arial', 'sans-serif'],
        'shabnam': ['Shabnam', 'Tahoma', 'Arial', 'sans-serif'],
        'vazir': ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'wood': '0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06)',
        'forest': '0 4px 6px -1px rgba(46, 139, 87, 0.1), 0 2px 4px -1px rgba(46, 139, 87, 0.06)',
        'elegant': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  // RTL support
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
