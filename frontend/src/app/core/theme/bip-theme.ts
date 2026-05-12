import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const BipPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf9f5',
      100: '#e8e6dc',
      200: '#d7d3c5',
      300: '#c5c0ab',
      400: '#b0aea5',
      500: '#d97757',
      600: '#c86948',
      700: '#ae5a3d',
      800: '#8d4932',
      900: '#6c3827',
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
