import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/toastizy.min.js',
        format: 'umd',
        name: 'Toastizy',
        plugins: [terser()],
      },
      {
        file: 'dist/toastizy.esm.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
        exclude: ['**/__tests__/**'],
      }),
      nodeResolve(),
      postcss({
        extract: true,
        minimize: true,
      }),
      terser(),
    ],
  },
];