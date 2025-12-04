/*
 * vite.config.js
 * Copyright (C) 2025 mailitg <mailitg@maili-mba.local>
 *
 * Distributed under terms of the MIT license.
 */

import { defineConfig } from 'vite'

export default defineConfig({
  base: '/my-3d-project/',
  appType: 'spa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500
  },
})