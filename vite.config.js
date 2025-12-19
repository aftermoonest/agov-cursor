import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'main.js'),
            name: 'Cursor',
            fileName: 'cursor-view',
            formats: ['iife'] // Immediately Invoked Function Expression for direct browser use
        },
        target: 'es2015', // Use modern syntax for smaller bundle
        minify: 'esbuild', // Ensure minification is active
        rollupOptions: {
            // Ensure we don't bundle dependencies if we don't want to, 
            // but for a single-file solution we probably DO want to bundle lottie-web.
            // So no external config needed here for lottie.
        }
    }
});
