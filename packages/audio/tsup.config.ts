import createTsupConfig from '@omi3/tsup';

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@omi3/utils', 'react'],
  treeshake: true,
  dts: {
    entry: 'src/index.ts',
    resolve: true,
  },
  esbuildOptions(options) {
    options.jsx = "transform";
  },
});
