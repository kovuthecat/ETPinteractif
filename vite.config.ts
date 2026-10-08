import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Port propre au projet (voir Outils/dev-launcher) : strictPort évite le basculement silencieux sur un autre port.
  server: { port: 5184, strictPort: true },
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
