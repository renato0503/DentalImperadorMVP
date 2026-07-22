import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logodental.png", "favicon.ico"],
      manifest: {
        name: "Dental Imperador",
        short_name: "Dental Imperador",
        description:
          "Plataforma B2B de atendimento para distribuidores de produtos odontológicos",
        theme_color: "#00A650",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        start_url: "/?source=pwa",
        scope: "/",
        categories: ["business", "medical", "odontology"],
        lang: "pt-BR",
        dir: "ltr",
        prefer_related_applications: false,
        icons: [
          {
            src: "logodental.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "logodental.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "firestore-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
