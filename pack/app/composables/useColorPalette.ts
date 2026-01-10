// app/composables/useColorPalette.ts
// Auto-generate color palette from a single base color

/**
 * Converts hex color to HSL values
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Converts HSL values to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Generate a full color palette from a single base color
 */
export function generatePalette(baseColor: string, isDark: boolean = true) {
    const { h, s, l } = hexToHsl(baseColor)

    if (isDark) {
        // Dark mode palette - base color is the body background
        return {
            // Backgrounds (progressively darker/lighter)
            body: baseColor,
            header: hslToHex(h, s, Math.max(l - 8, 3)),      // Darker for header
            footer: hslToHex(h, s, Math.max(l - 8, 3)),      // Same as header
            card: hslToHex(h, s, Math.min(l + 5, 25)),       // Slightly lighter for cards
            surface: hslToHex(h, s, Math.min(l + 3, 20)),    // Subtle surface

            // Borders
            border: hslToHex(h, Math.max(s - 10, 10), Math.min(l + 15, 35)),
            borderLight: hslToHex(h, Math.max(s - 15, 5), Math.min(l + 20, 40)),

            // Text colors (complementary - adjusted for contrast)
            textPrimary: hslToHex(h, Math.max(s - 40, 5), 95),        // Almost white
            textSecondary: hslToHex(h, Math.max(s - 30, 10), 70),     // Muted
            textMuted: hslToHex(h, Math.max(s - 35, 5), 50),          // Very muted

            // Accent (complementary hue)
            accent: hslToHex((h + 180) % 360, Math.min(s + 20, 80), 60),
        }
    } else {
        // Light mode palette - base color is the body background
        return {
            // Backgrounds
            body: baseColor,
            header: hslToHex(h, s, Math.min(l + 3, 100)),    // Slightly lighter
            footer: hslToHex(h, s, Math.min(l + 3, 100)),    // Same as header
            card: hslToHex(h, s, Math.min(l + 2, 100)),      // Subtle card bg
            surface: hslToHex(h, Math.max(s - 5, 0), l - 3), // Subtle surface

            // Borders
            border: hslToHex(h, Math.max(s - 5, 5), Math.max(l - 15, 70)),
            borderLight: hslToHex(h, Math.max(s - 10, 5), Math.max(l - 10, 80)),

            // Text colors
            textPrimary: hslToHex(h, Math.min(s + 10, 30), 15),        // Dark
            textSecondary: hslToHex(h, Math.max(s - 10, 10), 35),      // Muted dark
            textMuted: hslToHex(h, Math.max(s - 15, 5), 55),           // Light gray

            // Accent
            accent: hslToHex((h + 180) % 360, Math.min(s + 20, 70), 45),
        }
    }
}

/**
 * Generate CSS variables string from palette
 */
export function generateCssVariables(darkBase: string, lightBase: string): string {
    const dark = generatePalette(darkBase, true)
    const light = generatePalette(lightBase, false)

    return `
    :root {
      /* Dark Mode Colors */
      --dark-body: ${dark.body};
      --dark-header: ${dark.header};
      --dark-footer: ${dark.footer};
      --dark-card: ${dark.card};
      --dark-surface: ${dark.surface};
      --dark-border: ${dark.border};
      --dark-border-light: ${dark.borderLight};
      --dark-text: ${dark.textPrimary};
      --dark-text-secondary: ${dark.textSecondary};
      --dark-text-muted: ${dark.textMuted};
      --dark-accent: ${dark.accent};
      
      /* Light Mode Colors */
      --light-body: ${light.body};
      --light-header: ${light.header};
      --light-footer: ${light.footer};
      --light-card: ${light.card};
      --light-surface: ${light.surface};
      --light-border: ${light.border};
      --light-border-light: ${light.borderLight};
      --light-text: ${light.textPrimary};
      --light-text-secondary: ${light.textSecondary};
      --light-text-muted: ${light.textMuted};
      --light-accent: ${light.accent};
    }
    
    html, body { background-color: ${dark.body}; color: ${dark.textPrimary}; }
    html.light, html.light body { background-color: ${light.body}; color: ${light.textPrimary}; }
  `
}

export function useColorPalette() {
    return {
        generatePalette,
        generateCssVariables,
        hexToHsl,
        hslToHex
    }
}
