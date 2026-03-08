import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fizz: {
          50: '#fff0ff',
          100: '#ffe2ff',
          200: '#ffc2ff',
          300: '#ff92ff',
          400: '#ff57ff',
          500: '#ff1ff0',
          600: '#e20ed2',
          700: '#b607a7',
          800: '#7d0672',
          900: '#4c0546',
        },
        pop: {
          50: '#f7f3ff',
          100: '#ede6ff',
          200: '#d7c9ff',
          300: '#b69cff',
          400: '#8f62ff',
          500: '#6d2dff',
          600: '#5810ff',
          700: '#4707da',
          800: '#3b07b1',
          900: '#2f0786',
        },
        ink: {
          900: '#0b0620',
          950: '#070414',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-rounded', 'system-ui'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        fizz: '0 20px 60px rgba(255, 31, 240, 0.18), 0 8px 20px rgba(109, 45, 255, 0.16)',
        glass: '0 10px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        bubble: '28px',
      },
      backgroundImage: {
        'liquid-pop':
          'radial-gradient(1200px circle at 15% 10%, rgba(255,31,240,.35), transparent 45%), radial-gradient(900px circle at 70% 20%, rgba(109,45,255,.35), transparent 50%), radial-gradient(900px circle at 50% 90%, rgba(143,98,255,.22), transparent 55%)',
        'liquid-pop-dark':
          'radial-gradient(1200px circle at 10% 10%, rgba(255,31,240,.25), transparent 45%), radial-gradient(900px circle at 80% 25%, rgba(109,45,255,.25), transparent 55%), radial-gradient(900px circle at 50% 90%, rgba(143,98,255,.16), transparent 60%)',
      },
    },
  },
  plugins: [typography],
}

export default config
