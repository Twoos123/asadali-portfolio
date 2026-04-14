/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        glass: {
          surface: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.18)',
          deep: 'rgba(8, 47, 73, 0.55)',
          foam: 'rgba(236, 254, 255, 0.12)',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(8, 47, 73, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-lg': '0 20px 60px -10px rgba(8, 47, 73, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glow': '0 0 40px -8px rgba(56, 189, 248, 0.55)',
        'glow-strong': '0 0 60px -8px rgba(56, 189, 248, 0.75)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'float': 'float 10s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.animation-delay-300': { 'animation-delay': '300ms' },
        '.animation-delay-600': { 'animation-delay': '600ms' },
        '.glass-surface': {
          'background-color': 'rgba(255, 255, 255, 0.08)',
          'backdrop-filter': 'blur(16px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(16px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-surface-deep': {
          'background-color': 'rgba(8, 47, 73, 0.55)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.10)',
        },
        '.eyebrow': {
          'text-transform': 'uppercase',
          'letter-spacing': '0.18em',
          'font-size': '0.75rem',
          'font-weight': '600',
          'color': 'rgba(186, 230, 253, 0.85)',
        },
      });
    },
  ],
};
