/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./app/components/**/*.{js,vue,ts}",
        "./app/layouts/**/*.vue",
        "./app/pages/**/*.vue",
        "./app/plugins/**/*.{js,ts}",
        "./app/app.vue",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#879883",
                "background-light": "#f6f3ef",
                "background-dark": "#2a2825",
                "text-light": "#3a3835",
                "text-dark": "#e0ddd9",
                "accent-light": "#dce2da",
                "accent-dark": "#3a3835",
                "subtle-light": "#d1ccc6",
                "subtle-dark": "#4f4c48",
                "text-on-primary": "#f6f3ef",
                earth: {
                    50: '#F5F2F0',
                    100: '#EBE8E4',
                    200: '#D8D3CD',
                    300: '#BDB6AD',
                    400: '#9E9488',
                    500: '#807569',
                    600: '#635B51',
                    700: '#4A433C',
                    800: '#332E29',
                    900: '#1C1917',
                    950: '#0F0E0D',
                },
                sage: {
                    200: '#D9E3CC',
                    300: '#B4C5A0',
                    400: '#95A87E',
                    500: '#788B61',
                    600: '#5E6F48',
                    700: '#465336',
                },
                sand: {
                    300: '#E6D690',
                    500: '#C2B280',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [],
}
