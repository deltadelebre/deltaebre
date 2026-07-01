import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: "/" → desplegament a l'arrel d'un domini (cas de Netlify amb domini propi).
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png"],
      manifest: {
        name: "Guia del Delta de l'Ebre",
        short_name: "Delta de l'Ebre",
        description: "Guia turística del Delta de l'Ebre: platges, natura, restaurants, allotjament i agenda.",
        lang: "ca",
        theme_color: "#0a3f44",
        background_color: "#0a3f44",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: {
        // Precarrega l'embolcall de l'app (funciona offline un cop visitada).
        globPatterns: ["**/*.{js,css,html,svg}"],
        // No interceptem /admin (el CMS gestiona el seu propi cicle).
        navigateFallbackDenylist: [/^\/admin/],
        runtimeCaching: [
          {
            // Meteorologia (la consulta la fa l'app, no l'iframe): xarxa primer, amb còpia.
            urlPattern: ({ url }) => url.origin === "https://api.open-meteo.com",
            handler: "NetworkFirst",
            options: { cacheName: "weather", expiration: { maxEntries: 8, maxAgeSeconds: 3600 } },
          },
        ],
      },
      // El SW only s'activa al build/preview, no molesta en "npm run dev".
      devOptions: { enabled: false },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Separa el codi en chunks que es poden cachejar de manera independent:
        // el dataset gran ('data') no caduca quan canvia el codi de l'app, i a l'inrevés.
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("/src/data.js")) return "data";
          if (id.includes("/src/config.js")) return "config";
        },
      },
    },
  },
});
