import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('../apps/boutique/', import.meta.url));
const output = fileURLToPath(new URL('../public/boutique/', import.meta.url));

await build({
  configFile: false,
  root: app,
  base: '/boutique/',
  plugins: [react()],
  build: { outDir: output, emptyOutDir: true },
});
