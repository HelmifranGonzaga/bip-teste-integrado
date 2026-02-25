import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const SicoobPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0f7f5',
      100: '#b3ebe5',
      200: '#80ded3',
      300: '#4dd1c1',
      400: '#26c7b3',
      500: '#00ae9d', // Sicoob Green
      600: '#00a091',
      700: '#008f82',
      800: '#007d72',
      900: '#006c63',
      950: '#004a44'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#003641' // Sicoob Dark Blue
        }
      }
    }
  }
});
