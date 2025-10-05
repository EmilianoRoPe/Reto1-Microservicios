import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detectar si estamos en Docker
const useEsbuildWasm = process.env.DOCKER === 'true';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: useEsbuildWasm
    ? {
        // Forzar esbuild-wasm en Docker
        loader: 'js',
        implementation: require('esbuild-wasm'),
      }
    : {},
})
