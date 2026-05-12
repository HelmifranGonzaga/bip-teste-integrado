import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vitest-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setup-vitest.ts'],
    include: ['src/**/*.{spec,test}.{ts,mjs}'],
    exclude: ['node_modules', 'dist', 'e2e']
  }
});