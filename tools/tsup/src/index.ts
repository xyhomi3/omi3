import { Options } from 'tsup';

interface Omi3TsupOptions extends Omit<Options, 'entry'> {
  entry?: string | string[];
}

function createTsupConfig(options: Omi3TsupOptions = {}): Options {
  const { entry, ...restOptions } = options;

  return {
    entry: entry ? (Array.isArray(entry) ? entry : [entry]) : ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    ...restOptions,
    outExtension(ctx) {
      return {
        js: ctx.format === 'esm' ? '.mjs' : '.js',
      };
    },
  };
}

export default createTsupConfig;
