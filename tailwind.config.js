/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        brand: {
          cyan: '#00D4F5',
          coral: '#FF4D6D',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        archetype: {
          expert: '#3B82F6',
          'expert-dark': '#1E3A6E',
          'expert-bg': '#0D1B35',
          gueule: '#EF4444',
          'gueule-dark': '#7F1D1D',
          'gueule-bg': '#200808',
          leader: '#F59E0B',
          'leader-dark': '#78350F',
          'leader-bg': '#1C1000',
          explorateur: '#10B981',
          'explorateur-dark': '#064E3B',
          'explorateur-bg': '#021B14',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'cyan-glow': '0 0 30px rgba(0, 212, 245, 0.3)',
        'cyan-glow-sm': '0 0 15px rgba(0, 212, 245, 0.2)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
