import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hotam-prototype-v01/', // GitHub Pages 하위 경로 배포
})
