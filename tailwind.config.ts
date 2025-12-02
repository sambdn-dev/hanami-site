import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales Hanami
        hanami: {
          green: {
            primary: '#2D5016',
            accent: '#00C896',
            light: '#E8F2E6',
            dark: '#1A3D0A',
          },
          orange: {
            primary: '#FF8C42',
            light: '#FFF4E6',
            accent: '#FFA463',
          },
          beige: {
            bg: '#F5F3EF',
            border: '#E8E5DF',
            light: '#FAF9F7',
          },
          gray: {
            text: '#666666',
            muted: '#999999',
            dark: '#1A1A1A',
          },
        },
        // Couleurs mode Pro
        pro: {
          green: '#00D9A3',
          dark: {
            bg: '#0F1419',
            surface: '#1A1F29',
            border: '#2A2F3A',
          },
          gray: {
            text: '#A0A0A0',
            light: '#E8E8E8',
          },
        },
        // Couleurs sémantiques
        success: {
          light: '#F0FDF4',
          border: '#86EFAC',
          text: '#166534',
        },
        error: {
          light: '#FEF2F2',
          border: '#FCA5A5',
          text: '#991B1B',
          primary: '#DC2626',
        },
      },
      fontFamily: {
        logo: ['Fredoka', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'hanami': '8px',
        'hanami-lg': '12px',
        'hanami-xl': '16px',
        'hanami-2xl': '20px',
        'hanami-3xl': '24px',
      },
      boxShadow: {
        'hanami': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'hanami-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'hanami-green': '0 4px 16px rgba(0, 200, 150, 0.3)',
        'hanami-pro': '0 4px 16px rgba(0, 217, 163, 0.3)',
      },
      backgroundImage: {
        'gradient-hanami': 'linear-gradient(135deg, #2D5016, #FF8C42)',
        'gradient-pro': 'linear-gradient(135deg, #00D9A3, #FFA463)',
        'gradient-spring': 'linear-gradient(135deg, #FFE5F1 0%, #D4F1F4 50%, #C8E6C9 100%)',
        'gradient-summer': 'linear-gradient(135deg, #FFF59D 0%, #FFE082 30%, #FFAB91 70%, #FFCCBC 100%)',
        'gradient-autumn': 'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 30%, #D7CCC8 70%, #BCAAA4 100%)',
        'gradient-winter': 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 30%, #CFD8DC 70%, #B0BEC5 100%)',
        'gradient-exit-winter': 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 30%, #E1BEE7 70%, #F8BBD0 100%)',
      },
    },
  },
  plugins: [],
}
export default config
