/// <reference types="vitest" />
import { defineConfig
} from 'vite'

export default defineConfig
({
 test: {
        environment: 'jsdom',
        setupFiles: ['jest-canvas-mock'],
   // ... Specify options here.
 },
})