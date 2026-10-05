import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  build: { assets: 'assets' },
  vite: {
    build: { target: 'es2020' },
  },
});
