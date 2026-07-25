import { defineConfig } from 'vite'

/**
 * Build de un solo archivo, para publicar el juego como pagina autocontenida.
 * Nada de chunks ni assets externos: todo termina inline en un unico HTML.
 */
export default defineConfig({
  build: {
    outDir: 'dist-artifact',
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'bundle.js',
        assetFileNames: 'bundle.[ext]',
      },
    },
  },
})
