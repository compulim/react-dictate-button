import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'react-dictate-button-mocked-speech-recognition': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
