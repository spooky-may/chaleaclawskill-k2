/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        // Remapped to mascot sage-teal palette (from the eyes).
        // All existing sky-* classes in components adopt this without file changes.
        sky: {
          50:  '#f0f8f8',
          100: '#d9efee',
          200: '#b0dedd',
          300: '#84cbc9',
          400: '#61b8b5',
          500: '#52aaa7',   // primary — muted sage-teal from mascot eyes
          600: '#3d9794',
          700: '#2d7b78',
          800: '#1f5e5c',
          900: '#144140',
        },
        silver: {
          50:  '#f5f5f8',
          100: '#eaeaef',
          200: '#d4d4e0',
          300: '#b8bcd0',   // lavender-silver from robe
          400: '#9fa3bc',
          500: '#8589a8',
        },
        page: '#f3f4f7',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'drift': 'drift 18s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '20%, 80%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -30px)' },
        },
        drift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(250%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
