import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:      'src/index.ts',
    evidence:   'src/evidence.ts',
    policy:     'src/policy.ts',
    provenance: 'src/provenance.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  banner: {
    js: `/**
 * edaos-sdk v11.0.0
 * Evidence-Driven Autonomous Engineering SDK
 * Apache-2.0 License — https://edaos.org
 */`,
  },
})
