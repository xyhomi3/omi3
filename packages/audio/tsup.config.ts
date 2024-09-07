import createTsupConfig from '@omi3/tsup';

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@omi3/utils'],
});
