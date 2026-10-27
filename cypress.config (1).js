import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Vite dev server (npm run dev)
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: "cypress/e2e/**/*.cy.js",
    // The login/signup "drive to the dashboard" animation takes ~2.8s before
    // the app navigates to /user, so give assertions a little more time.
    defaultCommandTimeout: 8000,
    setupNodeEvents() {},
  },
});
