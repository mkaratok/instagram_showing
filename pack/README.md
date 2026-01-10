# Instagram Portfolio Package

A generic, high-performance portfolio website powered by Instagram, built with Nuxt 3.

## Features

- **Instagram API Integration:** dynamic content directly from your Instagram feed.
- **Generic & Reusable:** No hardcoded branding. Fully configurable via environment variables and admin panel.
- **Vercel Ready:** Optimized for Vercel serverless deployment.
- **Persistent Settings:** Settings saved via Admin Panel persist (using JSON bin or storage adapters) + Environment Variable overrides.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in your details:
    ```bash
    cp .env.example .env
    ```

    *   `NUXT_INSTAGRAM_ACCESS_TOKEN` & `BUSINESS_ID`: Required for fetching posts.
    *   `ADMIN_PASSWORD`: For the `/admin` panel.
    *   `SITE_NAME`, `BUSINESS_NAME`, etc.: Fallback values if Admin settings are empty.

3.  **Run Locally:**
    ```bash
    npm run dev
    ```

4.  **Admin Panel:**
    Go to `/admin` to configure site appearance, texts, and contact info via UI.

## Deployment (Vercel)

1.  Connect this repository to Vercel.
2.  Add the Environment Variables from `.env` to Vercel Project Settings.
3.  Deploy!

## Configuration Priority

The app uses a 3-layer configuration system to ensure robustness (especially on Vercel):
1.  **Admin Panel Settings:** Highest priority (dynamic).
2.  **Environment Variables:** Fallback if Admin settings are not set or lost.
3.  **Generic Defaults:** "Portfolio", "Contact", etc. as safe fallbacks.

## Customization

*   **Logo:** Replace `public/logo.png`.
*   **Icons:** Replace `public/icon.png` and `public/favicon.ico`.
*   **Colors:** Configurable via Admin Panel (Dark/Light base colors).
