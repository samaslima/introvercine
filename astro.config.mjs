import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { site } from './.astropod/astropod.config.json'

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [mdx(), sitemap(), tailwind()],
})
