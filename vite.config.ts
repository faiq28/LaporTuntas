import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' agar build dapat dipasang di domain root maupun sub-path (mis. GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 600 },
});
