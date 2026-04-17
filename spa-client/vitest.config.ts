import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    globals: true,
    // other test options as needed
  },
});
