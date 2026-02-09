/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    900: '#4A0413',
                    800: '#722F37', // Bordeaux Red
                    700: '#9A1B36',
                    100: '#FCE7EA',
                },
                // Functional Colors
                success: '#10B981',
                warning: '#F59E0B',
                error: '#E11D48',
                info: '#0EA5E9',
            },
            fontFamily: {
                sans: ['"Noto Sans TC"', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
