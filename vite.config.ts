/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor'
          if (id.includes('@tanstack/react-query')) return 'query'
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    env: {
      VITE_LEAGUE_ID: '1180618034447187968',
      VITE_API_BASE: 'https://api.sleeper.app/v1',
      VITE_CDN_BASE: 'https://sleepercdn.com',
      VITE_DICEBEAR_BASE: 'https://api.dicebear.com/7.x/pixel-art/svg',
      VITE_CURRENT_SEASON: '2024',
      VITE_PLAYOFF_START_WEEK: '15',
      VITE_REGULAR_SEASON_WEEKS: '14',
      VITE_TOTAL_WEEKS: '17',
    },
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/main.tsx'],
    },
  },
})
