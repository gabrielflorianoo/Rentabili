import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        VITE_API_URL: JSON.stringify('https://crispy-bassoon-5gjqwp7pj5r9hj76-3000.app.github.dev/'),
    },
})
