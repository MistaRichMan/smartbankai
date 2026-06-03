module.exports = {
  /** @type {import('tailwindcss').Config} */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2a4f8a',
          DEFAULT: '#1B365D',
          dark: '#0f1f38',
        },
        accent: {
          DEFAULT: '#F47558',
          light: '#f7906f',
          dark: '#d95e3f',
          green: '#00C896',
          amber: '#FFB020',
          red: '#FF4D4D',
          purple: '#7C3AED',
          cyan: '#06B6D4',
          teal: '#0D9488',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          card: '#FFFFFF',
          elevated: '#F0F2F5',
          border: '#E2E8F0',
          dark: '#343A40',
        },
        brand: {
          navy: '#1B365D',
          coral: '#F47558',
          light: '#F8F9FA',
          grey: '#8C757D',
          white: '#FFFFFF',
          dark: '#343A40',
        },
        neural: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d4ff',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neural': 'linear-gradient(135deg, #1B365D 0%, #2a4f8a 50%, #1B365D 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
        'gradient-primary': 'linear-gradient(135deg, #1B365D 0%, #2a4f8a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F47558 0%, #f7906f 100%)',
        'gradient-success': 'linear-gradient(135deg, #00C896 0%, #06B6D4 100%)',
        'gradient-danger': 'linear-gradient(135deg, #FF4D4D 0%, #FFB020 100%)',
      },
      boxShadow: {
        'glow-navy': '0 0 20px rgba(27, 54, 93, 0.2)',
        'glow-coral': '0 0 20px rgba(244, 117, 88, 0.3)',
        'glow-green': '0 0 20px rgba(0, 200, 150, 0.3)',
        'glow-red': '0 0 20px rgba(255, 77, 77, 0.3)',
        'glow-blue': '0 0 20px rgba(27, 54, 93, 0.2)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'card': '0 2px 12px rgba(27, 54, 93, 0.08)',
        'card-hover': '0 8px 32px rgba(27, 54, 93, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'data-flow': 'dataFlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        dataFlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
