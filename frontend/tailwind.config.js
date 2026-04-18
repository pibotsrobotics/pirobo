/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#F97316', // Orange-500
                secondary: '#EA580C', // Orange-600
                dark: {
                    900: '#000000', // Black
                    800: '#111827', // Gray-900 like
                    700: '#1F2937', // Gray-800 like
                    600: '#374151',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
