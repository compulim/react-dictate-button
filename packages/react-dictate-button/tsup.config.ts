import { defineConfig } from 'tsup';

export default defineConfig([
  {
    define: { IS_DEVELOPMENT: 'false' },
    dts: true,
    entry: {
      'react-dictate-button': './src/index.ts',
      'react-dictate-button.internal': './src/internal.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
