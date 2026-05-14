import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const BipPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf6f0',
      100: '#f5e6d8',
      200: '#ecccb5',
      300: '#e0b08e',
      400: '#d48d62',
      500: '#c96f3e',
      600: '#b45d30',
      700: '#9a4c26',
      800: '#7d3d1f',
      900: '#5e2e17',
      950: '#141413'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#faf9f5',
          50: '#f5f3ee',
          100: '#e8e6dc',
          200: '#d7d3c5',
          300: '#c5c0ab',
          400: '#b0aea5',
          500: '#8b887e',
          600: '#67645d',
          700: '#43413d',
          800: '#2a2926',
          900: '#1c1b19',
          950: '#141413'
        }
      }
    }
  }
});
