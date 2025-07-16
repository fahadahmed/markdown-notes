import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  esbuild: {
    target: 'esnext',
    format: 'esm',
  },
})
