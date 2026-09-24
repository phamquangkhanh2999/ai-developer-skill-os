import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.kilo/**',
      '**/.git/**',
      '**/node_modules/**',
      '**/.agents_cache/**'
    ],
    globals: true,
    runOnServer: true,
    pool: 'forks'
  }
});
