// composables/useTheme.ts
export const useTheme = () => {
    const isDark = useState('theme', () => false)

    const toggleTheme = () => {
        isDark.value = !isDark.value
        updateTheme()
    }

    const updateTheme = () => {
        if (import.meta.client) {
            const html = document.documentElement
            if (isDark.value) {
                html.classList.add('dark')
                localStorage.setItem('theme', 'dark')
            } else {
                html.classList.remove('dark')
                localStorage.setItem('theme', 'light')
            }
        }
    }

    const initTheme = () => {
        if (import.meta.client) {
            const storedTheme = localStorage.getItem('theme')
            if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                isDark.value = true
            } else {
                isDark.value = false
            }
            updateTheme()
        }
    }

    return {
        isDark,
        toggleTheme,
        initTheme
    }
}
