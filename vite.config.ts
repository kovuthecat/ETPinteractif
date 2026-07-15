import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        consultation: 'consultation.html',
        patient: 'patient.html',
      },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
