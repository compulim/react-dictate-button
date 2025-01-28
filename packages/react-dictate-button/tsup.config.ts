import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'react-dictate-button': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
