import { defineConfig } from "cypress";
 
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Vite dev server (npm run dev)
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: "cypress/e2e/**/*.cy.js",
    setupNodeEvents() {},
  },
});