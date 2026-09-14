import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.kilo/**',
      '**/.git/**',
      '**/.agents_cache/**'
    ]
  }
});

