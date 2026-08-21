import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'relative-public-assets',
      transform(code, id) {
        if (!/\.[cm]?[jt]sx?$/.test(id)) return null

        const previewed = code.replace(
          /(["'`])\/(portfolio|assets|hero)\/([^"'`?]+\.(?:png|jpe?g|webp|gif))/gi,
          '$1/previews/$2/$3.webp',
        )
        const transformed = previewed.replace(
          /(["'`])\/(portfolio|assets|hero|icons|logos|previews)\//g,
          '$1./$2/',
        )

        return transformed === code ? null : { code: transformed, map: null }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        masonry: resolve(import.meta.dirname, 'masonry.html'),
      },
    },
  },
})
