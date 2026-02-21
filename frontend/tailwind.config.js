/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#3b82f6', // blue-500
                    secondary: '#06b6d4', // cyan-500
                    accent: '#8b5cf6', // violet-500
                    dark: '#020617', // slate-950
                    surface: '#0f172a', // slate-900
                }
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(to right, #3b82f6, #06b6d4)',
                'gradient-surface': 'linear-gradient(to bottom right, #0f172a, #020617)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
