import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/data/site.ts'

function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml() {
      return [
        {
          tag: 'title',
          children: `${site.name} — ${site.role}`,
          injectTo: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'description', content: site.description },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
})
