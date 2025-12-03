import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.VITE_API_URL1': JSON.stringify(
            'https://crispy-bassoon-5gjqwp7pj5r9hj76-3000.app.github.dev/',
        ),
        'import.meta.env.PRODUCTION': JSON.stringify(false),
    },
});
