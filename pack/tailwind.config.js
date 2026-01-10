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
                    50: '#e8edf2',
                    100: '#d1dbe5',
                    200: '#a3b7cb',
                    300: '#7593b1',
                    400: '#5a7a9e',
                    500: '#4a6585',
                    600: '#3a506b',
                    700: '#2a3c52',
                    800: '#1a222d',
                    900: '#1a222d',
                    950: '#080707',
                },
                navy: {
                    800: '#1a222d',
                    900: '#151b24',
                    950: '#0f141a',
                },
                instagram: {
                    DEFAULT: '#8134af',
                    light: '#a855f7',
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
