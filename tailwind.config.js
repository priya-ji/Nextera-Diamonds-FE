/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Jewellery site palette — cool "diamond" tones, one warm accent
        midnight: {
          DEFAULT: '#12161c',
          800: '#1a2029',
          700: '#232b36',
        },
        porcelain: '#faf9f6',
        champagne: {
          DEFAULT: '#b08d57',
          light: '#c9a877',
          dark: '#8f6f3f',
        },
        // Inventory app neutrals + semantics
        ink: '#0f172a',
        slatey: '#64748b',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
}
