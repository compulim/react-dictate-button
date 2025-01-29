import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'react-dictate-button': './src/index.ts',
      'react-dictate-button.internal': './src/internal.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
