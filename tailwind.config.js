/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base:           '#0e0f21',
        surface:        '#13152b',
        'surface-2':    '#191b33',
        'surface-3':    '#20223d',
        accent:         '#f0ad4e',
        'accent-dim':   '#c4a461',
        'accent-text':  '#0e0f21',
        danger:         '#c0392b',
        'danger-dim':   '#7b241c',
        success:        '#27ae60',
        muted:          'rgba(255,255,255,0.38)',
        subtle:         'rgba(255,255,255,0.06)',
        border:         'rgba(255,255,255,0.09)',
        'border-strong':'rgba(255,255,255,0.18)',
      },
      fontFamily: {
        sans: [
          '"Palatino Linotype"', 'Palatino', '"Book Antiqua"',
          'Georgia', 'serif',
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm:  '2px',
        md:  '4px',
        lg:  '6px',
        xl:  '8px',
        full:'9999px',
      },
      animation: {
        blink:      'blink 1s step-end infinite',
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-dot':'pulseDot 1.4s ease-in-out infinite',
        thinking:   'thinking 1.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%':           { opacity: '1',   transform: 'scale(1)' },
        },
        thinking: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        gold:  '0 0 0 1px rgba(240,173,78,0.35)',
        glow:  '0 0 0 1px rgba(240,173,78,0.3)',
        panel: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
